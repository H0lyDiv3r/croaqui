#!/usr/bin/env bash
set -e

# Network namespace isolation script for P2P TURN testing
# Peer 1 (10.99.1.2) and Peer 2 (10.99.2.2) are on separate routed subnets (no Layer 2 bridge).
# Direct traffic between them is dropped by iptables, forcing traffic through coturn.

if [[ $EUID -ne 0 ]]; then
   echo "This script must be run with sudo: sudo $0 [setup|cleanup]"
   exit 1
fi

ACTION="${1:-setup}"

cleanup() {
    echo "Cleaning up network namespaces and interfaces..."
    ip netns del peer1 2>/dev/null || true
    ip netns del peer2 2>/dev/null || true
    ip link del veth1-host 2>/dev/null || true
    ip link del veth2-host 2>/dev/null || true
    ip link del br-iso 2>/dev/null || true

    # Clean up any previous iptables rules
    iptables -D FORWARD -s 10.99.1.0/24 -d 10.99.2.0/24 -j DROP 2>/dev/null || true
    iptables -D FORWARD -s 10.99.2.0/24 -d 10.99.1.0/24 -j DROP 2>/dev/null || true
    iptables -D FORWARD -s 10.99.0.10 -d 10.99.0.20 -j DROP 2>/dev/null || true
    iptables -D FORWARD -s 10.99.0.20 -d 10.99.0.10 -j DROP 2>/dev/null || true
    iptables -D FORWARD -s 10.99.0.0/16 -j ACCEPT 2>/dev/null || true
    iptables -D FORWARD -d 10.99.0.0/16 -j ACCEPT 2>/dev/null || true
    iptables -t nat -D POSTROUTING -s 10.99.0.0/16 -j MASQUERADE 2>/dev/null || true
    iptables -t nat -D POSTROUTING -s 10.99.0.0/24 -j MASQUERADE 2>/dev/null || true

    echo "Cleanup complete!"
}

setup() {
    cleanup

    echo "Enabling IP forwarding..."
    sysctl -w net.ipv4.ip_forward=1 >/dev/null

    echo "Creating network namespaces: peer1 and peer2..."
    ip netns add peer1
    ip netns add peer2

    echo "Setting up Peer 1 on Subnet 1 (10.99.1.0/24)..."
    ip link add veth1-host type veth peer name veth1-ns
    ip link set veth1-ns netns peer1
    ip addr add 10.99.1.1/24 dev veth1-host
    ip link set veth1-host up
    ip netns exec peer1 ip addr add 10.99.1.2/24 dev veth1-ns
    ip netns exec peer1 ip link set veth1-ns up
    ip netns exec peer1 ip link set lo up
    ip netns exec peer1 ip route add default via 10.99.1.1

    echo "Setting up Peer 2 on Subnet 2 (10.99.2.0/24)..."
    ip link add veth2-host type veth peer name veth2-ns
    ip link set veth2-ns netns peer2
    ip addr add 10.99.2.1/24 dev veth2-host
    ip link set veth2-host up
    ip netns exec peer2 ip addr add 10.99.2.2/24 dev veth2-ns
    ip netns exec peer2 ip link set veth2-ns up
    ip netns exec peer2 ip link set lo up
    ip netns exec peer2 ip route add default via 10.99.2.1

    echo "Enabling NAT masquerade for 10.99.0.0/16 (reaches Docker coturn & internet)..."
    iptables -t nat -A POSTROUTING -s 10.99.0.0/16 -j MASQUERADE
    iptables -A FORWARD -s 10.99.0.0/16 -j ACCEPT
    iptables -A FORWARD -d 10.99.0.0/16 -j ACCEPT

    echo "Blocking direct traffic between Peer 1 and Peer 2 at Layer 3..."
    iptables -I FORWARD -s 10.99.1.0/24 -d 10.99.2.0/24 -j DROP
    iptables -I FORWARD -s 10.99.2.0/24 -d 10.99.1.0/24 -j DROP

    echo "Setup complete!"
    echo "  peer1 IP: 10.99.1.2 (gateway 10.99.1.1)"
    echo "  peer2 IP: 10.99.2.2 (gateway 10.99.2.1)"
    echo "Direct traffic between peer1 and peer2 is BLOCKED."
    echo "Both peers can reach Docker's coturn (172.17.0.1:3478)."
}

if [[ "$ACTION" == "cleanup" ]]; then
    cleanup
else
    setup
fi
