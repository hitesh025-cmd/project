import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './style.css'
import type { Donor, BloodRequest, BloodInventoryItem, Hospital, SystemUser } from './types'
import { BLOOD_GROUPS } from './constants'
import { PublicApp } from './PublicApp'
import { AdminPortal } from './AdminPortal'

const defaultInventory: BloodInventoryItem[] = BLOOD_GROUPS.map(bloodGroup => ({
  bloodGroup,
  units: 0,
}))

const App: React.FC = () => {
  const [donors, setDonors] = React.useState<Donor[]>([])
  const [requests, setRequests] = React.useState<BloodRequest[]>([])
  const [inventory, setInventory] = React.useState<BloodInventoryItem[]>(defaultInventory)
  const [hospitals, setHospitals] = React.useState<Hospital[]>([])
  const [users, setUsers] = React.useState<SystemUser[]>([])

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicApp
              donors={donors}
              setDonors={setDonors}
              requests={requests}
              setRequests={setRequests}
              hospitals={hospitals}
            />
          }
        />
        <Route
          path="/admin"
          element={
            <AdminPortal
              donors={donors}
              setDonors={setDonors}
              requests={requests}
              setRequests={setRequests}
              inventory={inventory}
              setInventory={setInventory}
              hospitals={hospitals}
              setHospitals={setHospitals}
              users={users}
              setUsers={setUsers}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
