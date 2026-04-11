import React from 'react'
import { Link } from 'react-router-dom'
import type { Donor, BloodRequest, Hospital, BlogPost } from './types'
import { BLOOD_GROUPS, API_BASE_URL } from './constants'

type Props = {
  donors: Donor[]
  setDonors: React.Dispatch<React.SetStateAction<Donor[]>>
  requests: BloodRequest[]
  setRequests: React.Dispatch<React.SetStateAction<BloodRequest[]>>
  hospitals: Hospital[]
  blogs: BlogPost[]
}

export const PublicApp: React.FC<Props> = ({
  donors,
  setDonors,
  setRequests,
  hospitals,
  blogs,
}) => {
  const [tab, setTab] = React.useState<'donate' | 'availability' | 'request' | 'blog'>('donate')
  const [searchGroup, setSearchGroup] = React.useState('')
  const [searchCity, setSearchCity] = React.useState('')
  const [form, setForm] = React.useState({
    name: '',
    bloodGroup: '',
    city: '',
    contact: '',
    lastDonationDate: '',
  })
  const [requestForm, setRequestForm] = React.useState({
    patientName: '',
    bloodGroup: '',
    hospitalName: '',
    contact: '',
    units: 1,
    urgency: 'normal' as 'normal' | 'urgent' | 'critical',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleRequestChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setRequestForm(prev => ({
      ...prev,
      [name]: name === 'units' ? parseInt(String(value), 10) || 1 : value,
      ...(name === 'urgency' ? { urgency: value as 'normal' | 'urgent' | 'critical' } : {}),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.bloodGroup || !form.city || !form.contact) {
      alert('Please fill in all required fields.')
      return
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/donors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, available: true })
      })
      const newDonor = await res.json()
      setDonors(prev => [...prev, newDonor])
      setForm({
        name: '',
        bloodGroup: '',
        city: '',
        contact: '',
        lastDonationDate: '',
      })
      setTab('availability')
    } catch (err) {
      alert('Error adding donor')
    }
  }

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!requestForm.patientName || !requestForm.bloodGroup || !requestForm.contact) {
      alert('Please fill patient name, blood group, and contact.')
      return
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: requestForm.patientName,
          bloodGroup: requestForm.bloodGroup,
          hospitalName: requestForm.hospitalName || 'Not specified',
          contact: requestForm.contact,
          units: requestForm.units,
          urgency: requestForm.urgency,
        })
      })
      const newReq = await res.json()
      setRequests(prev => [...prev, newReq])
      setRequestForm({
        patientName: '',
        bloodGroup: '',
        hospitalName: '',
        contact: '',
        units: 1,
        urgency: 'normal',
      })
      alert('Blood request submitted. Admin will process it shortly.')
    } catch (err) {
      alert('Error submitting request')
    }
  }

  const filtered = donors.filter(d => {
    const matchGroup = searchGroup
      ? d.bloodGroup.toLowerCase() === searchGroup.toLowerCase()
      : true
    const matchCity = searchCity
      ? d.city.toLowerCase().includes(searchCity.toLowerCase())
      : true
    return matchGroup && matchCity && d.available
  })

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="logo-text">
          <span className="blood-drop">❤</span>
          <div>
            <h1>LifeLink Blood Bank</h1>
            <p>Donate blood, save lives.</p>
          </div>
        </div>
        <nav className="nav-row">
          <div className="tabs">
            <button
              className={tab === 'donate' ? 'tab active' : 'tab'}
              onClick={() => setTab('donate')}
            >
              Become a Donor
            </button>
            <button
              className={tab === 'availability' ? 'tab active' : 'tab'}
              onClick={() => setTab('availability')}
            >
              Check Availability
            </button>
            <button
              className={tab === 'request' ? 'tab active' : 'tab'}
              onClick={() => setTab('request')}
            >
              Request Blood
            </button>
            <button
              className={tab === 'blog' ? 'tab active' : 'tab'}
              onClick={() => setTab('blog')}
            >
              Latest News
            </button>
          </div>
          <Link to="/admin" className="admin-link">
            Admin
          </Link>
        </nav>
      </header>

      <main className="content">
        {tab === 'donate' ? (
          <section className="card wide">
            <h2>Register as a Blood Donor</h2>
            <p className="muted">
              Fill in your details to let nearby patients and hospitals find you
              when blood is urgently needed.
            </p>
            <form className="grid-form" onSubmit={handleSubmit}>
              <div className="field">
                <label>Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="field">
                <label>Blood Group *</label>
                <select
                  name="bloodGroup"
                  value={form.bloodGroup}
                  onChange={handleChange}
                >
                  <option value="">Select group</option>
                  {BLOOD_GROUPS.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>City / Area *</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="e.g. Delhi, Mumbai"
                />
              </div>
              <div className="field">
                <label>Contact Number *</label>
                <input
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  placeholder="Mobile / WhatsApp"
                />
              </div>
              <div className="field">
                <label>Last Donation Date</label>
                <input
                  type="date"
                  name="lastDonationDate"
                  value={form.lastDonationDate}
                  onChange={handleChange}
                />
              </div>
              <div className="actions">
                <button type="submit" className="primary-btn">
                  Save Donor Profile
                </button>
              </div>
            </form>
          </section>
        ) : tab === 'request' ? (
          <section className="card wide">
            <h2>Request Blood</h2>
            <p className="muted">
              Hospitals or patients can submit a blood request. Admin will
              approve and assign donors.
            </p>
            <form className="grid-form" onSubmit={handleRequestSubmit}>
              <div className="field">
                <label>Patient / Requester Name *</label>
                <input
                  name="patientName"
                  value={requestForm.patientName}
                  onChange={handleRequestChange}
                  placeholder="Name"
                />
              </div>
              <div className="field">
                <label>Blood Group Required *</label>
                <select
                  name="bloodGroup"
                  value={requestForm.bloodGroup}
                  onChange={handleRequestChange}
                >
                  <option value="">Select</option>
                  {BLOOD_GROUPS.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Hospital / Blood Bank</label>
                <select
                  name="hospitalName"
                  value={requestForm.hospitalName}
                  onChange={handleRequestChange}
                >
                  <option value="">— Select or type below —</option>
                  {hospitals.map(h => (
                    <option key={h.id} value={h.name}>{h.name}, {h.city}</option>
                  ))}
                </select>
              </div>
              {!requestForm.hospitalName && (
                <div className="field">
                  <label>Hospital name (if not listed)</label>
                  <input
                    name="hospitalName"
                    value={requestForm.hospitalName}
                    onChange={handleRequestChange}
                    placeholder="e.g. AIIMS Delhi"
                  />
                </div>
              )}
              <div className="field">
                <label>Contact *</label>
                <input
                  name="contact"
                  value={requestForm.contact}
                  onChange={handleRequestChange}
                  placeholder="Phone / Email"
                />
              </div>
              <div className="field">
                <label>Units needed</label>
                <input
                  type="number"
                  name="units"
                  min={1}
                  value={requestForm.units}
                  onChange={handleRequestChange}
                />
              </div>
              <div className="field">
                <label>Urgency</label>
                <select
                  name="urgency"
                  value={requestForm.urgency}
                  onChange={handleRequestChange}
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="actions">
                <button type="submit" className="primary-btn">
                  Submit Request
                </button>
              </div>
            </form>
          </section>
        ) : tab === 'blog' ? (
          <section className="card wide">
            <h2>Latest News & Updates</h2>
            <p className="muted">Stay informed about blood donation drives and health tips.</p>
            <div className="donor-list" style={{ maxHeight: 'none' }}>
              {blogs.map(post => (
                <article key={post.id} className="donor-item" style={{ cursor: 'default' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{post.title}</h3>
                    <span className="badge" style={{ background: 'rgba(29, 78, 216, 0.1)', color: '#1d4ed8' }}>
                      {post.createdAt}
                    </span>
                  </div>
                  <p style={{ margin: '8px 0', color: '#4b5563', lineHeight: '1.6' }}>{post.content}</p>
                  <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: 12, fontWeight: 500 }}>
                    By {post.author}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : (
          <section className="layout-2col">
            <div className="card">
              <h2>Search Blood Availability</h2>
              <p className="muted">
                Filter by blood group and city to find matching donors.
              </p>
              <div className="grid-form">
                <div className="field">
                  <label>Blood Group</label>
                  <select
                    value={searchGroup}
                    onChange={e => setSearchGroup(e.target.value)}
                  >
                    <option value="">Any</option>
                    {BLOOD_GROUPS.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>City / Area</label>
                  <input
                    value={searchCity}
                    onChange={e => setSearchCity(e.target.value)}
                    placeholder="Type city name"
                  />
                </div>
              </div>
            </div>
            <div className="card">
              <h2>Available Donors</h2>
              {filtered.length === 0 ? (
                <p className="muted">
                  No donors found yet. Try changing filters or add donors from
                  the registration tab.
                </p>
              ) : (
                <ul className="donor-list">
                  {filtered.map(d => (
                    <li key={d.id} className="donor-item">
                      <div className="donor-main">
                        <div>
                          <h3>{d.name}</h3>
                          <p className="muted">
                            {d.city} • Last donation:{' '}
                            {d.lastDonationDate || 'Not specified'}
                          </p>
                        </div>
                        <span className="badge">{d.bloodGroup}</span>
                      </div>
                      <p className="contact">Contact: {d.contact}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <p>
          Blood donation services, please connect
          with your nearest hospital or authorized blood bank.
        </p>
      </footer>
    </div>
  )
}
