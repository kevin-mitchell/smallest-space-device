#include <stdio.h>
#include <string.h>
#include "esp_wifi.h"

// see: https://docs.espressif.com/projects/esp-idf/en/v5.3.1/esp32/api-guides/wifi.html#wi-fi-reason-code

char *get_wifi_disconnection_string(wifi_err_reason_t wifi_err_reason)
{
    switch (wifi_err_reason)
    {
    case WIFI_REASON_UNSPECIFIED:
        return "WIFI_REASON_UNSPECIFIED: Generally, it means an internal failure, e.g., the memory runs out, the internal TX fails, or the reason is received from the remote side.";
    case WIFI_REASON_AUTH_EXPIRE:
        return "WIFI_REASON_AUTH_EXPIRE: The previous authentication is no longer valid.";
    case WIFI_REASON_AUTH_LEAVE:
        return "WIFI_REASON_AUTH_LEAVE: De-authenticated, because the sending station is leaving (or has left).";
    case WIFI_REASON_ASSOC_EXPIRE:
        return "WIFI_REASON_ASSOC_EXPIRE: Disassociated due to inactivity.";
    case WIFI_REASON_ASSOC_TOOMANY:
        return "WIFI_REASON_ASSOC_TOOMANY: Disassociated, because the AP is unable to handle all currently associated STAs at the same time.";
    case WIFI_REASON_NOT_AUTHED:
        return "WIFI_REASON_NOT_AUTHED: Class-2 frame received from a non-authenticated STA.";
    case WIFI_REASON_NOT_ASSOCED:
        return "WIFI_REASON_NOT_ASSOCED: Class-3 frame received from a non-associated STA.";
    case WIFI_REASON_ASSOC_LEAVE:
        return "WIFI_REASON_ASSOC_LEAVE: Disassociated, because the sending station is leaving (or has left) BSS.";
    case WIFI_REASON_ASSOC_NOT_AUTHED:
        return "WIFI_REASON_ASSOC_NOT_AUTHED: Station requesting (re)association is not authenticated by the responding STA.";
    case WIFI_REASON_DISASSOC_PWRCAP_BAD:
        return "WIFI_REASON_DISASSOC_PWRCAP_BAD: Disassociated, because the information in the Power Capability element is unacceptable.";
    case WIFI_REASON_DISASSOC_SUPCHAN_BAD:
        return "WIFI_REASON_DISASSOC_SUPCHAN_BAD: Disassociated, because the information in the Supported Channels element is unacceptable.";
    case WIFI_REASON_BSS_TRANSITION_DISASSOC:
        return "WIFI_REASON_BSS_TRANSITION_DISASSOC: AP wants us to move to another AP, sent as a part of BTM procedure.";
    case WIFI_REASON_IE_INVALID:
        return "WIFI_REASON_IE_INVALID: Invalid element in the frame.";
    case WIFI_REASON_MIC_FAILURE:
        return "WIFI_REASON_MIC_FAILURE: Message integrity code (MIC) failure.";
    case WIFI_REASON_4WAY_HANDSHAKE_TIMEOUT:
        return "WIFI_REASON_4WAY_HANDSHAKE_TIMEOUT: Four-way handshake times out.";
    case WIFI_REASON_GROUP_KEY_UPDATE_TIMEOUT:
        return "WIFI_REASON_GROUP_KEY_UPDATE_TIMEOUT: Group-Key Handshake times out.";
    case WIFI_REASON_IE_IN_4WAY_DIFFERS:
        return "WIFI_REASON_IE_IN_4WAY_DIFFERS: The element in the four-way handshake differs from the association frames.";
    case WIFI_REASON_GROUP_CIPHER_INVALID:
        return "WIFI_REASON_GROUP_CIPHER_INVALID: Invalid group cipher.";
    case WIFI_REASON_PAIRWISE_CIPHER_INVALID:
        return "WIFI_REASON_PAIRWISE_CIPHER_INVALID: Invalid pairwise cipher.";
    case WIFI_REASON_AKMP_INVALID:
        return "WIFI_REASON_AKMP_INVALID: Invalid AKMP.";
    case WIFI_REASON_UNSUPP_RSN_IE_VERSION:
        return "WIFI_REASON_UNSUPP_RSN_IE_VERSION: Unsupported RSNE version.";
    case WIFI_REASON_INVALID_RSN_IE_CAP:
        return "WIFI_REASON_INVALID_RSN_IE_CAP: Invalid RSNE capabilities.";
    case WIFI_REASON_802_1X_AUTH_FAILED:
        return "WIFI_REASON_802_1X_AUTH_FAILED: IEEE 802.1X authentication failed.";
    case WIFI_REASON_CIPHER_SUITE_REJECTED:
        return "WIFI_REASON_CIPHER_SUITE_REJECTED: Cipher suite rejected due to security policies.";
    case WIFI_REASON_TDLS_PEER_UNREACHABLE:
        return "WIFI_REASON_TDLS_PEER_UNREACHABLE: TDLS peer unreachable via the direct link.";
    case WIFI_REASON_TDLS_UNSPECIFIED:
        return "WIFI_REASON_TDLS_UNSPECIFIED: TDLS direct-link teardown for unspecified reason.";
    case WIFI_REASON_SSP_REQUESTED_DISASSOC:
        return "WIFI_REASON_SSP_REQUESTED_DISASSOC: Disassociated because session terminated by SSP request.";
    case WIFI_REASON_NO_SSP_ROAMING_AGREEMENT:
        return "WIFI_REASON_NO_SSP_ROAMING_AGREEMENT: Disassociated due to lack of SSP roaming agreement.";
    case WIFI_REASON_BAD_CIPHER_OR_AKM:
        return "WIFI_REASON_BAD_CIPHER_OR_AKM: Service rejected due to SSP cipher suite or AKM requirement.";
    case WIFI_REASON_NOT_AUTHORIZED_THIS_LOCATION:
        return "WIFI_REASON_NOT_AUTHORIZED_THIS_LOCATION: Requested service not authorized in this location.";
    case WIFI_REASON_SERVICE_CHANGE_PERCLUDES_TS:
        return "WIFI_REASON_SERVICE_CHANGE_PERCLUDES_TS: TS deleted due to insufficient bandwidth for QoS STA.";
    case WIFI_REASON_UNSPECIFIED_QOS:
        return "WIFI_REASON_UNSPECIFIED_QOS: Disassociated for unspecified QoS-related reason.";
    case WIFI_REASON_NOT_ENOUGH_BANDWIDTH:
        return "WIFI_REASON_NOT_ENOUGH_BANDWIDTH: QoS AP lacks sufficient bandwidth for QoS STA.";
    case WIFI_REASON_MISSING_ACKS:
        return "WIFI_REASON_MISSING_ACKS: Disassociated due to excessive unacknowledged frames.";
    case WIFI_REASON_EXCEEDED_TXOP:
        return "WIFI_REASON_EXCEEDED_TXOP: STA is transmitting outside its TXOPs.";
    case WIFI_REASON_STA_LEAVING:
        return "WIFI_REASON_STA_LEAVING: Requesting STA is leaving the BSS.";
    case WIFI_REASON_END_BA:
        return "WIFI_REASON_END_BA: Requesting STA is no longer using the stream or session.";
    case WIFI_REASON_UNKNOWN_BA:
        return "WIFI_REASON_UNKNOWN_BA: Requesting STA received frames for an unestablished setup.";
    case WIFI_REASON_TIMEOUT:
        return "WIFI_REASON_TIMEOUT: Requested from peer STA due to timeout.";
    case WIFI_REASON_PEER_INITIATED:
        return "WIFI_REASON_PEER_INITIATED: Disassociated because authorized access limit reached.";
    case WIFI_REASON_AP_INITIATED:
        return "WIFI_REASON_AP_INITIATED: Disassociated due to external service requirements.";
    case WIFI_REASON_INVALID_FT_ACTION_FRAME_COUNT:
        return "WIFI_REASON_INVALID_FT_ACTION_FRAME_COUNT: Invalid FT Action frame count.";
    case WIFI_REASON_INVALID_PMKID:
        return "WIFI_REASON_INVALID_PMKID: Invalid pairwise master key identifier (PMKID).";
    case WIFI_REASON_INVALID_MDE:
        return "WIFI_REASON_INVALID_MDE: Invalid MDE.";
    case WIFI_REASON_INVALID_FTE:
        return "WIFI_REASON_INVALID_FTE: Invalid FTE.";
    case WIFI_REASON_TRANSMISSION_LINK_ESTABLISH_FAILED:
        return "WIFI_REASON_TRANSMISSION_LINK_ESTABLISH_FAILED: Transmission link establishment failed.";
    case WIFI_REASON_ALTERATIVE_CHANNEL_OCCUPIED:
        return "WIFI_REASON_ALTERATIVE_CHANNEL_OCCUPIED: The alternative channel is occupied.";
    case WIFI_REASON_BEACON_TIMEOUT:
        return "WIFI_REASON_BEACON_TIMEOUT: Station loses N beacons continuously.";
    case WIFI_REASON_NO_AP_FOUND:
        return "WIFI_REASON_NO_AP_FOUND: Station fails to scan the target AP.";
    case WIFI_REASON_AUTH_FAIL:
        return "WIFI_REASON_AUTH_FAIL: Authentication fails, but not due to timeout.";
    case WIFI_REASON_ASSOC_FAIL:
        return "WIFI_REASON_ASSOC_FAIL: Association fails, but not due to inactivity or too many stations.";
    case WIFI_REASON_HANDSHAKE_TIMEOUT:
        return "WIFI_REASON_HANDSHAKE_TIMEOUT: Handshake fails due to timeout.";
    case WIFI_REASON_CONNECTION_FAIL:
        return "WIFI_REASON_CONNECTION_FAIL: Connection to the AP has failed.";
    case WIFI_REASON_AP_TSF_RESET:
        return "WIFI_REASON_AP_TSF_RESET: Disconnection happened due to AP's TSF reset.";
    case WIFI_REASON_ROAMING:
        return "WIFI_REASON_ROAMING: Station is roaming to another AP.";
    case WIFI_REASON_ASSOC_COMEBACK_TIME_TOO_LONG:
        return "WIFI_REASON_ASSOC_COMEBACK_TIME_TOO_LONG: Assoc comeback time in association response is too high.";
    default:
        return "Reason code not recognized or reserved.";
    }
}
