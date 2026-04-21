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
    accidentType: formData.type || undefined,
    injuries: formData.injuries ?? [],
    fault: formData.fault || undefined,
    faultAtFault: formData.faultAtFault || undefined,
    evInvolved: formData.evInvolved === 'Yes' || formData.evInvolved === 'No' ? formData.evInvolved : undefined,
    commercialVehicle: formData.commercialVehicle === 'Yes' || formData.commercialVehicle === 'No' ? formData.commercialVehicle : undefined,
    rideshareInvolved: formData.rideshareInvolved || undefined,
    when: formData.when || undefined,
    reportedTo: formData.reportedTo,
    cameras: formData.cameras === 'Yes' || formData.cameras === 'No' ? formData.cameras : undefined,
    witnesses: formData.witnesses === 'Yes' || formData.witnesses === 'No' ? formData.witnesses : undefined,
    surface: formData.surface || undefined,
    lighting: formData.lighting || undefined,
    hasOwnInsurance: formData.hasOwnInsurance === 'Yes' || formData.hasOwnInsurance === 'No' ? formData.hasOwnInsurance : undefined,
    myInsurer: formData.myInsurer || undefined,
    otherInsurer: formData.otherInsurer || undefined,
    adjusterContacted: formData.adjuster === 'Yes' || formData.adjuster === 'No' ? formData.adjuster : undefined,
    hasLawyer: formData.hiredLawyer === 'Yes' || formData.hiredLawyer === 'No' ? formData.hiredLawyer : undefined,
    onTheJob: formData.onTheJob === 'Yes' || formData.onTheJob === 'No' ? formData.onTheJob : undefined,
    caseDescription: formData.description || undefined,
    zipCode: formData.zip || undefined,
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
