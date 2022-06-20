import csv
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
import time

geolocator = Nominatim(user_agent="bloomworks_co_care_directory")

addresses_to_skip = ["179 Parkside Dr, Colorado Springs, CO 80910",
                     "875 Moreno Ave., Colorado Springs, CO 80903",
                     "20 Lodge Dr. W., South Fork, Colorado 81154",
                     "14443 Highway 160, Del Norte, Colorado 81132",
                     "720 North Main Street, #330, Pueblo, CO 81003"]


def process_data():
    account_name_to_latlong = {}
    geocoded_ladders_extract = []
    processed_accounts = []

    # making it so that this script can be run multiple times to deal w nominatum timeouts
    with open('geocoded_ladders_extract.csv', 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            geocoded_ladders_extract.append(row)
            processed_accounts.append(row["Account ID"])
        print(f"{len(processed_accounts)} accounts already processed")

    # this is the data from the data portal. it does not have all the columns
    # of the extract, but does have latlong
    with open('ladders_open_data_20220610.csv', 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row["LATITUDE"] and row["LONGITUDE"]:
                # need to match by name and city b/c extract doesn't have the same id
                account_name_to_latlong[row["Account_Name"]] = {
                    "lat": float(row["LATITUDE"]),
                    "long": float(row["LONGITUDE"]),
                    "city": row["City"]
                }

    print("adding location data to ladders extract")
    # this is the ladders extract with the data we want to use
    # it is missing geocoding
    with open('ladders_extract_20220614.csv', 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row["Account ID"] not in processed_accounts:
                print(f'processing account id {row["Account ID"]}')
                account_name = row["Account Name"]
                address_string = row["Provider Location Display Label"].replace(
                    "_BR_ENCODED_", ", ")
                lat = None
                long = None
                source = None

                if account_name in account_name_to_latlong and row["Billing City"] == account_name_to_latlong[account_name]["city"]:
                    # get latlong from ladders open data when we can
                    print("latlong found in ladders open data")
                    lat = account_name_to_latlong[account_name]["lat"]
                    long = account_name_to_latlong[account_name]["long"]
                    source = "ladders_open_data_20220610"
                elif address_string in addresses_to_skip or "suite" in address_string.lower() or "unit" in address_string.lower() and "po box" not in address_string.lower():
                    # don't fully understand why or how (maybe to prevent abuse?) but there are some addresses where nominatum
                    # fails to geocode and consistently times out instead of returning None
                    # also, nominatum consistently fails when there is address info outside of a street address, so just skip those
                    print("skipping geocoding")
                else:
                    # otherwise try to geocode w nominatum
                    try:
                        location = geolocator.geocode(address_string)
                        if(location):
                            print(
                                "latlong not in ladders data, geocoded with nominatum")
                            lat = location.latitude
                            long = location.longitude
                            source = "nominatum_geocoder"
                        else:
                            print("row not found in ladders data, unable to geocode")
                        time.sleep(2)
                    except GeocoderTimedOut as e:
                        print("geocoder timed out")
                        break

                row["latitude"] = lat
                row["longitude"] = long
                row["latlong_source"] = source
                geocoded_ladders_extract.append(row)

    # write geocoded data
    with open('geocoded_ladders_extract.csv', 'w', newline='') as f:
        fieldnames = geocoded_ladders_extract[0].keys()
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(geocoded_ladders_extract)


if __name__ == "__main__":
    process_data()
