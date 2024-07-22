'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"

interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  countryOfCitizenship: string
  status: 'PENDING' | 'REACHED_OUT'
  submittedAt: string
}

const filterSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['ALL', 'PENDING', 'REACHED_OUT']).optional(),
})

export default function InternalLeadsList() {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: '',
      status: 'ALL',
    },
  })

  useEffect(() => {
    fetchLeads()
  }, [currentPage])

  async function fetchLeads() {
    setIsLoading(true)
    const filters = form.getValues()
    const searchParams = new URLSearchParams({
      page: currentPage.toString(),
      ...(filters.search && { search: filters.search }),
      ...(filters.status && { status: filters.status }),
    })

    try {
      const response = await fetch(`/api/leads?${searchParams}`)
      if (response.status === 401) {
        router.push('/login')
        return
      }
      if (!response.ok) {
        throw new Error('Failed to fetch leads')
      }
      const data = await response.json()
      setLeads(data.leads)
      setTotalPages(data.totalPages)
      setIsLoading(false)
    } catch (error) {
      setError('Failed to fetch leads')
      setIsLoading(false)
    }
  }

  async function handleStatusChange(id: string, newStatus: 'PENDING' | 'REACHED_OUT') {
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update lead status')
      }

      fetchLeads()
    } catch (error) {
      console.error('Error updating lead status:', error)
    }
  }

  function handleFilterSubmit(data: z.infer<typeof filterSchema>) {
    setCurrentPage(1)
    fetchLeads()
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Internal Leads Management</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFilterSubmit)} className="flex gap-4 mb-4">
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input placeholder="Search" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ALL">All</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="REACHED_OUT">Reached Out</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <Button type="submit">Filter</Button>
        </form>
      </Form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>{`${lead.firstName} ${lead.lastName}`}</TableCell>
              <TableCell>{new Date(lead.submittedAt).toLocaleString()}</TableCell>
              <TableCell>{lead.status}</TableCell>
              <TableCell>{lead.countryOfCitizenship}</TableCell>
              <TableCell>
                {lead.status === 'PENDING' && (
                  <Button onClick={() => handleStatusChange(lead.id, 'REACHED_OUT')}>
                    Mark as Reached Out
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <Button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )
}