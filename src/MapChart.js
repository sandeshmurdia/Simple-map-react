import React, { useEffect, useState, useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { csv } from "d3-fetch";
import { scaleLinear } from "d3-scale";
import sortBy from "lodash/sortBy";

const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-continents.json";

const MapChart = () => {
  const [data, setData] = useState([]);
  const [maxValue, setMaxValue] = useState(0);

  useEffect(() => {
    csv("/data.csv").then((cities) => {
      const sortedCities = sortBy(cities, (o) => -o.population);
      setMaxValue(sortedCities[0].population);
      setData(sortedCities);
    });
  }, []);

  const popScale = useMemo(
    () => scaleLinear().domain([0, maxValue]).range([0, 20]),
    [maxValue]
  );

  return (
    <>
      <ComposableMap
        projectionConfig={{ rotate: [-10, 0, 0] }}
        className="map-size"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography key={geo.rsmKey} geography={geo} fill="#464D67" />
            ))
          }
        </Geographies>
        {data.map(({ city_code, lng, lat, population, city, country }) => {
          return (
            <Marker key={city_code} coordinates={[lng, lat]}>
              <g>
                <circle
                  fill="#975cc44c"
                  stroke="#975CC4"
                  r={popScale(population)}
                  className="location"
                />
                <title>{`${city}, ${country}`}</title>
              </g>
            </Marker>
          );
        })}
      </ComposableMap>
    </>
  );
};

export default MapChart;
