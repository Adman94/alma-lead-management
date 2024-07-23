// lib/leadsStore.ts

export type Lead = {
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
  
  // Use a closure to maintain state between requests
  const leadsStore = (() => {
    let leads: Lead[] = [];
  
    return {
      addLead: (lead: Lead) => {
        leads.push(lead);
      },
      updateLead: (id: string, updates: Partial<Lead>) => {
        const index = leads.findIndex(lead => lead.id === id);
        if (index !== -1) {
          leads[index] = { ...leads[index], ...updates };
          return leads[index];
        }
        return null;
      },
      getLead: (id: string) => {
        return leads.find(lead => lead.id === id) || null;
      },
      getLeads: () => {
        return [...leads]; // Return a copy to prevent direct mutation
      }
    };
  })();
  
  export const { addLead, updateLead, getLead, getLeads } = leadsStore;