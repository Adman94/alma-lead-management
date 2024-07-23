'use client'

import { useEffect, useState, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { Lead } from '@/lib/leadsStore'
import React from 'react'

export default function InternalLeadsList() {
  const [leads, setLeads] = useState<typeof Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<typeof Lead[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const leadsPerPage = 8
  const router = useRouter()

  useEffect(() => {
    fetchLeads()
  }, [])

  useEffect(() => {
    filterLeads()
  }, [leads, search, statusFilter])

  async function fetchLeads() {
    try {
      const response = await fetch('/api/leads')
      if (response.ok) {
        const data = await response.json()
        setLeads(data.leads)
      } else {
        console.error('Failed to fetch leads')
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
    }
  }

  function filterLeads() {
    let filtered = leads
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter((lead: typeof Lead) => 
        lead.firstName.toLowerCase().includes(searchLower) ||
        lead.lastName.toLowerCase().includes(searchLower) ||
        lead.email.toLowerCase().includes(searchLower) ||
        lead.countryOfCitizenship.toLowerCase().includes(searchLower)
      )
    }
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((lead: typeof Lead) => lead.status === statusFilter)
    }
    setFilteredLeads(filtered)
  }

  async function updateLeadStatus(id: string, newStatus: 'PENDING' | 'REACHED_OUT') {
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchLeads()
      } else {
        console.error('Failed to update lead status')
      }
    } catch (error) {
      console.error('Error updating lead status:', error)
    }
  }

  const indexOfLastLead = currentPage * leadsPerPage
  const indexOfFirstLead = indexOfLastLead - leadsPerPage
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead)

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Leads</h1>
        <Button onClick={() => router.push('/submit-lead')}>Submit New Lead</Button>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <Input
          placeholder="Search"
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="REACHED_OUT">Reached Out</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Visa Categories</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentLeads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>{`${lead.firstName} ${lead.lastName}`}</TableCell>
              <TableCell>{new Date(lead.submittedAt).toLocaleString()}</TableCell>
              <TableCell>{lead.status}</TableCell>
              <TableCell>{lead.countryOfCitizenship}</TableCell>
              <TableCell>{lead.visaCategories.join(', ')}</TableCell>
              <TableCell>
                <Button 
                  onClick={() => updateLeadStatus(lead.id, 'PENDING')} 
                  disabled={lead.status === 'PENDING'}
                  className="mr-2"
                >
                  Mark Pending
                </Button>
                <Button 
                  onClick={() => updateLeadStatus(lead.id, 'REACHED_OUT')} 
                  disabled={lead.status === 'REACHED_OUT'}
                >
                  Mark Reached Out
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end space-x-2 mt-4">
        <Button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredLeads.length / leadsPerPage)))}
          disabled={currentPage === Math.ceil(filteredLeads.length / leadsPerPage)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}