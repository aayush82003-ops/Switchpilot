# SwitchPilot — Universal Switch Manager

Meraki-inspired universal switch management dashboard.

## Current prototype
- Add TP-Link, Cisco, Hikvision, Ubiquiti, HPE/Aruba, D-Link, Netgear, or Generic SNMP switches
- Dashboard and device list
- Port visualization and demo control
- PoE and alert display
- PWA structure for iPhone home-screen installation

## Important
A browser/iPhone cannot directly and safely perform every SNMP/SSH action against a LAN switch. For real hardware control, add a backend/API adapter:

iPhone PWA -> HTTPS API -> brand/model adapter -> SNMP / SSH / REST / NETCONF -> Switch

The UI is functional in demo mode. Real control requires device credentials and model-specific adapters.
