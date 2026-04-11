import { supabase } from './supabase'

export async function submitLead(formData) {
  const params = new URLSearchParams(window.location.search)
  const utm = {
    source: params.get('utm_source') || undefined,
    medium: params.get('utm_medium') || undefined,
    campaign: params.get('utm_campaign') || undefined,
  }

  const body = {
    caseType: formData.caseType,
    accidentType: formData.accidentType,
    injuries: formData.injuries ?? [],
    fault: formData.fault || undefined,
    faultAtFault: formData.faultAtFault || undefined,
    evInvolved: formData.evInvolved || undefined,
    commercialVehicle: formData.commercialVehicle || undefined,
    rideshareInvolved: formData.rideshareInvolved || undefined,
    when: formData.when || undefined,
    reportedTo: formData.reportedTo,
    cameras: formData.cameras || undefined,
    witnesses: formData.witnesses || undefined,
    surface: formData.surface || undefined,
    lighting: formData.lighting || undefined,
    hasOwnInsurance: formData.hasOwnInsurance || undefined,
    myInsurer: formData.myInsurer || undefined,
    otherInsurer: formData.otherInsurer || undefined,
    adjusterContacted: formData.adjusterContacted || undefined,
    hasLawyer: formData.hasLawyer || undefined,
    onTheJob: formData.onTheJob || undefined,
    caseDescription: formData.caseDescription || undefined,
    zipCode: formData.zipCode || undefined,
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    utm,
    referrer: document.referrer || undefined,
    website: formData.website ?? '',
  }

  const { data, error } = await supabase.functions.invoke('submit-lead', {
    body,
  })

  if (error) {
    const err = new Error(error.message || 'submission failed')
    err.status = error.context?.status
    throw err
  }
  return data
}
