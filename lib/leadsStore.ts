// lib/leadsStore.ts

export interface Lead {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    countryOfCitizenship: string;
    linkedinUrl?: string;
    visaCategories: string[];
    helpDescription: string;
    status: 'PENDING' | 'REACHED_OUT';
    submittedAt: string;
    resumeFilename: string | null;
  }
  
  export let leads: Lead[] = [];
  
  export function addLead(lead: Lead) {
    leads.push(lead);
  }
  
  export function updateLead(id: string, updates: Partial<Lead>) {
    const index = leads.findIndex(lead => lead.id === id);
    if (index !== -1) {
      leads[index] = { ...leads[index], ...updates };
      return leads[index];
    }
    return null;
  }
  
  export function getLead(id: string) {
    return leads.find(lead => lead.id === id) || null;
  }
  
  export function getLeads() {
    return leads;
  }