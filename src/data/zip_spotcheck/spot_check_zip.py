import csv
import json
import math
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


def count_results_within_radius(latlong, radius, locations):
    count = 0
    for location in locations:
        if haversine_distance_miles((latlong["lat"], latlong["lng"]), (location["lat"], location["lng"])) <= radius:
            count += 1
    return count


def run_spot_check():

    zip_to_latlong = {}
    with open('../colorado_zip_latlong.json', 'r') as file:
        zip_to_latlong = json.load(file)

    distances = []
    distances_by_zip = {zip: [] for zip in zip_to_latlong}
    all_co_zip_location_data = []
    zip_result_counts = []

    with open('../geocoding_ladders/geocoded_ladders_extract.csv', 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if(row["latitude"] and row["longitude"]) and row["Billing Zip/Postal Code"] and row["latlong_source"] == "ladders_open_data_20220610":
                clean_zip = row["Billing Zip/Postal Code"][:5]
                if clean_zip in zip_to_latlong:
                    zip_center = zip_to_latlong[clean_zip]
                    row_lat = float(row["latitude"])
                    row_long = float(row["longitude"])
                    distance = haversine_distance_miles(
                        (zip_center["lat"], zip_center["lng"]), (row_lat, row_long))
                    distances.append(distance)
                    distances_by_zip[clean_zip].append(distance)
                    all_co_zip_location_data.append({
                        "id": row["Account ID"],
                        "miles_to_zip_center": round(distance, 1),
                        "address": row["Provider Location Display Label"],
                        "zip": clean_zip,
                        "lat": row_lat,
                        "lng": row_long,
                        "latlong_source": row["latlong_source"],
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

    # number of results per zip
    for zip, latlong in zip_to_latlong.items():
        zip_result_counts.append({
            "zip": zip,
            "results_within_1_mi": count_results_within_radius(latlong, 1, all_co_zip_location_data),
            "results_within_5_mi": count_results_within_radius(latlong, 5, all_co_zip_location_data),
            "results_within_10_mi": count_results_within_radius(latlong, 10, all_co_zip_location_data),
            "results_within_15_mi": count_results_within_radius(latlong, 15, all_co_zip_location_data),
            "results_within_20_mi": count_results_within_radius(latlong, 20, all_co_zip_location_data),
            "results_within_25_mi": count_results_within_radius(latlong, 25, all_co_zip_location_data),
        })
    sorted_zip_result_counts = sorted(
        zip_result_counts, key=lambda x: x["results_within_25_mi"], reverse=True)
    with open('zip_radius_result_counts.csv', 'w', newline='') as f:
        fieldnames = zip_result_counts[0].keys()
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(sorted_zip_result_counts)

    # worst offenders by location
    sorted_location_data = sorted(
        all_co_zip_location_data, key=lambda x: x["miles_to_zip_center"], reverse=True)
    print("\nwriting to file: spot_check_locations.csv")
    with open('spot_check_locations.csv', 'w', newline='') as f:
        fieldnames = all_co_zip_location_data[0].keys()
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(sorted_location_data)


if __name__ == "__main__":
    run_spot_check()
