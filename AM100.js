/**
 * Ursalink AM100 / AM102 Payload Decoder
 *
 * definition [channel-id] [channel-type] [channel-data]
 *
 * 01: battery      -> 0x01 0x75 [1byte]  Unit: %
 * 03: temperature  -> 0x03 0x67 [2bytes] Unit: °C
 * 04: humidity     -> 0x04 0x68 [1byte]  Unit: %
 * 05: PIR          -> 0x05 0x6A [2bytes] 
 * 06: illumination -> 0x06 0x65 [6bytes] Unit: lux
 * ------------------------------------------ AM100
 * 07: CO2          -> 0x07 0x7D [2bytes] Unit: ppm
 * 08: TVOC         -> 0x08 0x7D [2bytes] Unit: ppb
 * 09: Pressure     -> 0x09 0x73 [2bytes] Unit: hPa
 * ------------------------------------------ AM102
 */
function Decoder(bytes, port) {
    var decoded = {};

    for (var i = 0; i < bytes.length;) {
        var channel_id = bytes[i++];
        var channel_type = bytes[i++];
        // BATTERY
        if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery = bytes[i];
            i += 1;
        }
        // TEMPERATURE
        else if (channel_id === 0x03 && channel_type === 0x67) {
            decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // HUMIDITY
        else if (channel_id === 0x04 && channel_type === 0x68) {
            decoded.humidity = bytes[i] / 2;
            i += 1;
        }
        // PIR
        else if (channel_id === 0x05 && channel_type === 0x6A) {
            decoded.activity = readInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
        // LIGHT
        else if (channel_id === 0x06 && channel_type === 0x65) {
            decoded.illumination = readInt16LE(bytes.slice(i, i+2));
           // decoded.infrared_and_visible = readInt16LE(bytes.slice(i + 2, i + 4));
           // decoded.infrared = readInt16LE(bytes.slice(i + 4, i + 6));
            i += 6;
        }
        // CO2
        else if (channel_id === 0x07 && channel_type === 0x7D) {
            decoded.co2 = readInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
        // TVOC
        else if (channel_id === 0x08 && channel_type === 0x7D) {
            decoded.tvoc = readInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
        // PRESSURE
        else if (channel_id === 0x09 && channel_type === 0x73) {
            decoded.pressure = readInt16LE(bytes.slice(i, i + 2));
            i += 2;
        } else {
            break;
        }
    }
    return decoded;
}

/* ******************************************
 * bytes to number
 ********************************************/
function readUInt16LE(bytes) {
    var value = (bytes[1] << 8) + bytes[0];
    return value & 0xffff;
}

function readInt16LE(bytes) {
    var ref = readUInt16LE(bytes);
    return ref > 0x7fff ? ref - 0x10000 : ref;
}
