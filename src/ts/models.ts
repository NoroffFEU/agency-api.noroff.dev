class Application {
  uuid: string
  listingId: string
  listing: Listing
  applicantId: string
  applicant: Applicant
  coverLetter: string
}

enum ListingState {
  Active,
  Ended
}

class Listing {
  uuid: string
  title: string
  tags: string[]
  description: string
  requirements: string[]
  deadline: Date
  created: Date
  updated: Date
}

enum OfferState {
  Pending,
  Accepted,
  Rejected
}

class Offer {
  uuid: string
  listingId: string
  listing: Listing
  applicationId: string
  application: Application
  applicantId: string
  applicant: Applicant
  state: OfferState
}

enum UserRole {
  Applicant,
  Client,
  Admin
}

class User {
  uuid: string
  email: string
  firstName: string
  lastName: string
  password: string
  role: UserRole
}

class Applicant extends User {
  skills: string[]
  profile: string
  avatar: string
  phone: string
  offers: Offer[]
}

class Client extends User {
  sector: string
  company: string
  logo: string
  phone: string
}