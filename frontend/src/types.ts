export type Donor = {
  id: number
  name: string
  bloodGroup: string
  city: string
  contact: string
  lastDonationDate: string
  available: boolean
}

export type BloodRequestStatus = 'pending' | 'approved' | 'rejected' | 'fulfilled'

export type BloodRequest = {
  id: number
  patientName: string
  bloodGroup: string
  hospitalName: string
  hospitalId?: number
  contact: string
  units: number
  urgency: 'normal' | 'urgent' | 'critical'
  status: BloodRequestStatus
  assignedDonorId: number | null
  createdAt: string
}

export type BloodInventoryItem = {
  bloodGroup: string
  units: number
}

export type Hospital = {
  id: number
  name: string
  city: string
  address: string
  contact: string
  email: string
}

export type UserRole = 'donor' | 'hospital' | 'admin'

export type SystemUser = {
  id: number
  name: string
  email: string
  role: UserRole
  blocked: boolean
  linkedDonorId?: number
  linkedHospitalId?: number
}
export type BlogPost = {
  id: number
  title: string
  content: string
  author: string
  createdAt: string
}

export type ActivityLog = {
  id: number
  action: string
  details: string
  adminUser: string
  createdAt: string
}
