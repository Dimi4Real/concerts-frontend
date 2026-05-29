'use client'
import Link from "next/link";
import { useEffect } from "react";
import useListData from "@/hooks/useListData";
import { Spinner } from "reactstrap";

export default function Home() {
  const { getData, loading, data } = useListData();

  useEffect(() => {
    getData('event/get-list');
  }, []);

  return (
      <div>
        {/* Hero sekcija */}
        <div className="hero-section">
          <h1>🎵 Concerts</h1>
          <p>Pronađite i istražite najbolje koncerte u vašem gradu</p>
          <div>
            <Link href="/events" className="btn me-2">
              🎟️ Pogledaj koncerte
            </Link>
            <Link href="/artists" className="btn">
              🎤 Izvođači
            </Link>
          </div>
        </div>

        {/* Najnoviji koncerti */}
        <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
          <h3 style={{fontSize: '1.5rem', fontWeight: '700', margin: 0}}>
            Najnoviji koncerti
          </h3>
          <Link href="/events" className="btn btn-outline-primary btn-sm">
            Vidi sve →
          </Link>
        </div>

        {loading && (
            <div className="text-center py-5">
              <Spinner />
            </div>
        )}

        <div className="row">
          {data && data.slice(0, 6).map((event) => (
              <div key={event.id} className="col-md-4 mb-3">
                <div className="card h-100">
                  <div className="card-body p-4">
                    <h5 className="card-title mb-3">{event.name}</h5>
                    <p className="text-muted mb-2">
                      🎤 <strong>{event.artistName}</strong>
                    </p>
                    <p className="text-muted mb-2">
                      📍 {event.venueName}, {event.venueCity}
                    </p>
                    <p className="text-muted mb-2">
                      📅 {new Date(event.eventDate).toLocaleDateString('sr-RS')}
                    </p>
                    <hr />
                    <p className="fw-bold text-primary mb-0">
                      🎟️ {event.ticketPrice?.toLocaleString()} RSD
                    </p>
                  </div>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
}