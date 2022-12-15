class Application {
  uuid: string
  listingId: string
  applicantId: string
  coverLetter: string
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

class Offer {
  uuid: string
  listingId: string
  applicationId: string
  applicantId: string
  state: boolean
}

class User {
  uuid: string
  email: string
  firstName: string
  lastName: string
  password: string
  role: string
}

class Applicant extends User {
  skills: string[]
  profile: string
  avatar: string
  phone: string
}

class Client extends User {
  sector: string
  company: string
  logo: string
  phone: string
}