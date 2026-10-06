'use client';

import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const iconUrl = typeof markerIcon === "string" ? markerIcon : markerIcon.src;
const iconRetinaUrl = typeof markerIcon2x === "string" ? markerIcon2x : markerIcon2x.src;
const shadowUrl = typeof markerShadow === "string" ? markerShadow : markerShadow.src;

const defaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

type MapProps = {
  center?: number[];
};

function MapCenter({ center }: MapProps) {
  const map = useMap();

  useEffect(() => {
    if (center && center.length >= 2) {
      map.setView([center[0], center[1]], 6, { animate: true });
    }
  }, [center, map]);

  return null;
}

export default function Map({ center }: MapProps) {
  const initialCenter = center?.length && center.length >= 2
    ? [center[0], center[1]] as L.LatLngExpression
    : [12.8797, 121.774] as L.LatLngExpression;

  return (
    <MapContainer
      center={initialCenter}
      zoom={6}
      scrollWheelZoom={false}
      className="h-[35vh] rounded-lg"
    >
      <MapCenter center={center} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {center && center.length >= 2 && (
        <Marker position={[center[0], center[1]]} />
      )}
    </MapContainer>
  );
}