import nepalBankImg from '../images/NepalBankLimited.jpg'
import visitNepalImg from '../images/Visit Nepal Platform.jpeg'
import medicalImg from '../images/Medical Image Analysis.png'
import bhatbhateniImg from '../images/bhatbhateni.png'

/** Local images in the same order as seeded case studies */
export const CASE_STUDY_IMAGES = [
  nepalBankImg,    // AI-Powered Loan Risk Scoring — Nepal Bank
  visitNepalImg,   // Smart Tourism Recommender — Visit Nepal Platform
  medicalImg,      // Medical Image Analysis — Kathmandu Diagnostics
  bhatbhateniImg,  // Inventory Optimisation — Bhatbhateni Superstore
]

const TITLE_MATCHERS = [
  { test: /loan|risk scoring|nepal bank|credit scoring/i, src: nepalBankImg },
  { test: /tourism|visit nepal|recommender|itinerary/i, src: visitNepalImg },
  { test: /medical|diagnostics|x-ray|image analysis/i, src: medicalImg },
  { test: /bhatbhateni|inventory|superstore|forecasting|demand/i, src: bhatbhateniImg },
]

/** Resolve display image for a case study (API URL, local asset, or null). */
export function getProjectImage(project, index = 0) {
  if (project?.image_url) return project.image_url

  const title = project?.title || ''
  for (const { test, src } of TITLE_MATCHERS) {
    if (test.test(title)) return src
  }

  return CASE_STUDY_IMAGES[index % CASE_STUDY_IMAGES.length] ?? null
}
