'use client'
import { useEffect, useState } from "react";
import useListData from "@/hooks/useListData";
import DataTable from "react-data-table-component";
import { Spinner, Button, Row, Col } from "reactstrap";
import { useAuth } from "@/contexts/authContext";
import { useListActions } from "@/contexts/listActionContext";
import listAction from "@/core/listAction";
import { CiEdit, CiTrash } from "react-icons/ci";
import AllEventDialogs from "@/elements/Event/AllEventDialogs";
import { get } from "@/core/httpClient";

export default function Events() {
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const { state: authState } = useAuth();
    const { state: listState, dispatch } = useListActions();
    const { getData, loading, data } = useListData();

    // Filter stanja
    const [artists, setArtists] = useState([]);
    const [venues, setVenues] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedArtist, setSelectedArtist] = useState("");
    const [selectedVenue, setSelectedVenue] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");

    const isAdmin = authState.isAuthenticated && authState.user?.role === 'ADMIN';

    // Ucitaj filtere pri pokretanju
    useEffect(() => {
        get('artist/get-list').then(res => setArtists(res.data));
        get('venue/get-list').then(res => setVenues(res.data));
        get('genre/get-list').then(res => setGenres(res.data));
    }, []);

    // Ucitaj evente
    useEffect(() => {
        if (selectedArtist) {
            getData(`event/get-by-artist/${selectedArtist}`);
        } else if (selectedVenue) {
            getData(`event/get-by-venue/${selectedVenue}`);
        } else {
            getData(`event/get-page-list?pageNumber=${pageNumber - 1}&pageSize=${pageSize}`);
        }
    }, [pageNumber, pageSize, listState.reload, selectedArtist, selectedVenue]);

    // Filter po zanru radimo na frontendu jer backend nema taj endpoint
    const filteredEvents = () => {
        let events = [];

        if (selectedArtist || selectedVenue) {
            // get-by-artist i get-by-venue vracaju listu direktno
            events = Array.isArray(data) ? data : [];
        } else {
            events = data?.events || [];
        }

        if (selectedGenre) {
            events = events.filter(event => {
                const artist = artists.find(a => a.id === event.artistId);
                return artist?.genres?.some(g => g.id === parseInt(selectedGenre));
            });
        }

        return events;
    };

    const resetFilters = () => {
        setSelectedArtist("");
        setSelectedVenue("");
        setSelectedGenre("");
        setPageNumber(1);
    };

    const tableColumns = [
        {
            name: 'Naziv',
            selector: (row) => row.name,
            sortable: true
        },
        {
            name: 'Datum',
            selector: (row) => new Date(row.eventDate).toLocaleDateString('sr-RS'),
            sortable: true
        },
        {
            name: 'Izvođač',
            selector: (row) => row.artistName,
            sortable: true
        },
        {
            name: 'Mesto',
            selector: (row) => `${row.venueName} - ${row.venueCity}`,
            sortable: false
        },
        {
            name: 'Cena karte',
            selector: (row) => `${row.ticketPrice?.toLocaleString()} RSD`,
            sortable: true
        },
        ...(isAdmin ? [{
            name: 'Opcije',
            cell: (row) => (
                <>
                    <Button
                        className="btn btn-light me-1"
                        onClick={() => dispatch({ type: listAction.UPDATE, payload: row })}
                    >
                        <CiEdit />
                    </Button>
                    <Button
                        className="btn btn-light"
                        onClick={() => dispatch({ type: listAction.DELETE, payload: row })}
                    >
                        <CiTrash />
                    </Button>
                </>
            )
        }] : [])
    ];

    const hasActiveFilter = selectedArtist || selectedVenue || selectedGenre;

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{fontWeight: '700'}}>Koncerti</h2>
                {isAdmin && (
                    <Button
                        className="btn btn-primary"
                        onClick={() => dispatch({ type: listAction.CREATE })}
                    >
                        + Dodaj koncert
                    </Button>
                )}
            </div>

            {/* Filter sekcija */}
            <div className="card p-3 mb-4">
                <h6 className="mb-3 fw-bold text-muted">🔍 Filtriraj koncerte</h6>
                <Row>
                    <Col md={3} className="mb-2">
                        <label className="form-label">Izvođač</label>
                        <select
                            className="form-select"
                            value={selectedArtist}
                            onChange={(e) => {
                                setSelectedArtist(e.target.value);
                                setSelectedVenue("");
                                setSelectedGenre("");
                            }}
                        >
                            <option value="">-- Svi izvođači --</option>
                            {artists.map(artist => (
                                <option key={artist.id} value={artist.id}>
                                    {artist.name}
                                </option>
                            ))}
                        </select>
                    </Col>

                    <Col md={3} className="mb-2">
                        <label className="form-label">Mesto održavanja</label>
                        <select
                            className="form-select"
                            value={selectedVenue}
                            onChange={(e) => {
                                setSelectedVenue(e.target.value);
                                setSelectedArtist("");
                                setSelectedGenre("");
                            }}
                        >
                            <option value="">-- Sva mesta --</option>
                            {venues.map(venue => (
                                <option key={venue.id} value={venue.id}>
                                    {venue.name} - {venue.city}
                                </option>
                            ))}
                        </select>
                    </Col>

                    <Col md={3} className="mb-2">
                        <label className="form-label">Žanr</label>
                        <select
                            className="form-select"
                            value={selectedGenre}
                            onChange={(e) => {
                                setSelectedGenre(e.target.value);
                                setSelectedArtist("");
                                setSelectedVenue("");
                            }}
                        >
                            <option value="">-- Svi žanrovi --</option>
                            {genres.map(genre => (
                                <option key={genre.id} value={genre.id}>
                                    {genre.name}
                                </option>
                            ))}
                        </select>
                    </Col>

                    <Col md={3} className="mb-2 d-flex align-items-end">
                        {hasActiveFilter && (
                            <Button
                                color="outline-secondary"
                                className="w-100"
                                onClick={resetFilters}
                            >
                                ✕ Ukloni filtere
                            </Button>
                        )}
                    </Col>
                </Row>

                {hasActiveFilter && (
                    <div className="mt-2">
                        <small className="text-muted">
                            Aktivni filter: {" "}
                            {selectedArtist && <span className="badge bg-primary me-1">
                                Izvođač: {artists.find(a => a.id === parseInt(selectedArtist))?.name}
                            </span>}
                            {selectedVenue && <span className="badge bg-primary me-1">
                                Mesto: {venues.find(v => v.id === parseInt(selectedVenue))?.name}
                            </span>}
                            {selectedGenre && <span className="badge bg-primary me-1">
                                Žanr: {genres.find(g => g.id === parseInt(selectedGenre))?.name}
                            </span>}
                        </small>
                    </div>
                )}
            </div>

            {data != null && (
                <DataTable
                    data={filteredEvents()}
                    columns={tableColumns}
                    striped={true}
                    pagination
                    paginationServer={!selectedArtist && !selectedVenue && !selectedGenre}
                    progressPending={loading}
                    paginationTotalRows={
                        !selectedArtist && !selectedVenue && !selectedGenre
                            ? data?.totalElements
                            : filteredEvents().length
                    }
                    onChangePage={(page) => setPageNumber(page)}
                    onChangeRowsPerPage={(newPerPage, page) => {
                        setPageSize(newPerPage);
                        setPageNumber(page);
                    }}
                    progressComponent={<Spinner color="primary">Učitavanje...</Spinner>}
                    highlightOnHover
                    noDataComponent="Nema koncerata za izabrane filtere"
                />
            )}

            <AllEventDialogs />
        </>
    );
}