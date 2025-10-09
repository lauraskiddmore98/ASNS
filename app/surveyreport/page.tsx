"use client"

import { useFormStore } from "@/hooks/use-form-store"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function SurveyReport() {
  const { formData } = useFormStore()

  const formatFieldName = (key: string) => {
    return key
      .split(/(?=[A-Z])/)
      .join(" ")
      .toLowerCase()
      .replace(/^\w/, c => c.toUpperCase())
  }

  const downloadReport = () => {
    const json = JSON.stringify(formData, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const href = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = href
    link.download = "survey-report.json"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(href)
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Survey Report</CardTitle>
          <Button variant="outline" onClick={downloadReport}>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(formData).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell className="font-medium">{formatFieldName(key)}</TableCell>
                  <TableCell>
                    {Array.isArray(value) ? (
                      <ul className="list-disc pl-4">
                        {value.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    ) : typeof value === "boolean" ? (
                      value ? "Yes" : "No"
                    ) : (
                      value
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}