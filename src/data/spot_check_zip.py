import csv
import json
import math
import itertools
import statistics


def haversine_distance_miles(origin, destination):
    # from https://stackoverflow.com/questions/19412462/getting-distance-between-two-points-based-on-latitude-longitude
    lat1, lon1 = origin
    lat2, lon2 = destination
    radius = 3958.8  # earth radius in miles

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = (math.sin(dlat / 2) * math.sin(dlat / 2) +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) * math.sin(dlon / 2))
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    d = radius * c

    return d


def format_percentage(numerator, denominator):
    return str(round(numerator/denominator*100, 1))+"%"


def run_spot_check():

    zip_to_latlong = {}
    with open('colorado_zip_latlong.json', 'r') as file:
        zip_to_latlong = json.load(file)

    distances = []
    distances_by_zip = {zip: [] for zip in zip_to_latlong}
    all_chsd_location_data = []

    with open('chsd_clinicians_20220611.csv', 'r') as file_c, open('chsd_organizations_20220611.csv', 'r') as file_o:
        reader_c = csv.DictReader(file_c)
        reader_o = csv.DictReader(file_o)
        for row in itertools.chain(reader_c, reader_o):
            if(row["GeoLat"] and row["GeoLong"]):
                clean_zip = row["Zip"][:5]
                zip_center = zip_to_latlong[clean_zip]
                row_lat = float(row["GeoLat"])
                row_long = float(row["GeoLong"])
                distance = haversine_distance_miles(
                    (zip_center["lat"], zip_center["lng"]), (row_lat, row_long))
                distances.append(distance)
                distances_by_zip[clean_zip].append(distance)
                all_chsd_location_data.append({
                    "entity_id": row["EntityId"],
                    "miles_to_zip_center": round(distance, 1),
                    "address": f'{row["Address1"]} {row["Address2"]} {row["City"]}',
                    "zip": clean_zip,
                    "lat": row_lat,
                    "long": row_long,
                    "zip_center_lat": zip_center["lat"],
                    "zip_center_long": zip_center["lng"],
                    "geocoded_outside_co": row_lat < 36.99 or row_lat > 40.99 or row_long < -109.06 or row_long > -102.04
                })

    with open('ladders_20220614.csv', 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if(row["GeoLat"] and row["GeoLong"]):
                clean_zip = row["Zip"][:5]
                zip_center = zip_to_latlong[clean_zip]
                row_lat = float(row["GeoLat"])
                row_long = float(row["GeoLong"])
                distance = haversine_distance_miles(
                    (zip_center["lat"], zip_center["lng"]), (row_lat, row_long))
                distances.append(distance)
                distances_by_zip[clean_zip].append(distance)
                all_chsd_location_data.append({
                    "entity_id": row["EntityId"],
                    "miles_to_zip_center": round(distance, 1),
                    "address": f'{row["Address1"]} {row["Address2"]} {row["City"]}',
                    "zip": clean_zip,
                    "lat": row_lat,
                    "long": row_long,
                    "zip_center_lat": zip_center["lat"],
                    "zip_center_long": zip_center["lng"],
                    "geocoded_outside_co": row_lat < 36.99 or row_lat > 40.99 or row_long < -109.06 or row_long > -102.04
                })

    # summary stats
    count = len(distances)
    over_1 = [d for d in distances if d > 1]
    over_5 = [d for d in distances if d > 5]
    over_10 = [d for d in distances if d > 10]
    print(
        f"avg distance from location to zip center: {round(statistics.mean(distances), 1)}")
    print(f"{format_percentage(len(over_1), count)} of locations are over 1 mile from zip center")
    print(f"{format_percentage(len(over_5), count)} of locations are over 5 miles from zip center")
    print(f"{format_percentage(len(over_10), count)} of locations are over 10 miles from zip center")

    # worst offenders by zip
    zip_summaries = [{"zip": zip, "avg_miles_from_center": round(statistics.mean(distances), 1), "median_miles_from_center": round(statistics.median(
        distances), 1), "count_locations": len(distances)} for zip, distances in distances_by_zip.items() if len(distances)]
    sorted_zip_summaries = sorted(
        zip_summaries, key=lambda x: x["count_locations"], reverse=True)
    print("\nwriting to file: spot_check_zip_summaries.csv")
    with open('spot_check_zip_summaries.csv', 'w', newline='') as f:
        fieldnames = ['zip', 'avg_miles_from_center',
                      'median_miles_from_center', 'count_locations']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(sorted_zip_summaries)

    # worst offenders by location - chsd
    sorted_location_data = sorted(
        all_chsd_location_data, key=lambda x: x["miles_to_zip_center"], reverse=True)
    print("\nwriting to file: spot_check_locations.csv")
    with open('spot_check_locations.csv', 'w', newline='') as f:
        fieldnames = ["entity_id", "miles_to_zip_center", "address", "zip",
                      "lat", "long", "zip_center_lat", "zip_center_long", "geocoded_outside_co"]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(sorted_location_data)


if __name__ == "__main__":
    run_spot_check()
