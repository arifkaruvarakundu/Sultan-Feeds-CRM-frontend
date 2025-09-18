import { useState, useCallback } from "react"
import { Card} from "../ui/card"
import CardContent from "../ui/cardContent"
import  CardHeader from "../ui/cardHeader"
import  CardTitle from "../ui/cardTitle"
import  Button  from "../ui/Button"
import { Upload, FileSpreadsheet, X, CheckCircle, Brain, Loader2 } from "lucide-react"
import { cn } from "../../lib/utils"
import axios from "axios"
import API_BASE_URL from "../../../api_config"

export default function FileUpload() {
    
  const [files, setFiles] = useState([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [analysisError, setAnalysisError] = useState("")

  const handleDragOver = useCallback((e) => {

    e.preventDefault()
    setIsDragOver(true)

  }, [])

  const handleDragLeave = useCallback((e) => {

    e.preventDefault()
    setIsDragOver(false)

  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    processFiles(droppedFiles)

  }, [])

  const handleFileSelect = useCallback((e) => {

    const selectedFiles = Array.from(e.target.files || [])
    processFiles(selectedFiles)

  }, [])

  const processFiles = (fileList) => {
    // For now, only handle single file for AI analysis
    if (fileList.length > 0) {
      setSelectedFile(fileList[0])
    }

    const newFiles = fileList.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
      progress: 0,
      file: file, // Store actual file object
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Simulate file processing
    newFiles.forEach((_, index) => {
      simulateFileProcessing(files.length + index)
    })
  }

  const simulateFileProcessing = (fileIndex) => {
    const interval = setInterval(() => {
      setFiles((prev) => {
        const updated = [...prev]
        const file = updated[fileIndex]

        if (!file) {
          clearInterval(interval)
          return prev
        }

        if (file.status === "uploading" && file.progress < 100) {
          file.progress += Math.random() * 20
          if (file.progress >= 100) {
            file.progress = 100
            file.status = "processing"
          }
        } else if (file.status === "processing") {
          setTimeout(() => {
            setFiles((prev) => {
              const updated = [...prev]
              if (updated[fileIndex]) {
                updated[fileIndex].status = "completed"
              }
              return updated
            })
          }, 2000)
          clearInterval(interval)
        }

        return updated
      })
    }, 200)
  }

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleAIAnalysis = async () => {
    if (!selectedFile) return

    try {
      setAnalysisLoading(true)
      setAnalysisError("")
      setAnalysisResult(null)

      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await axios.post(`${API_BASE_URL}/analyze/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      console.log("analysis response:", response.data)

      setAnalysisResult(response.data)
    } catch (error) {
      setAnalysisError(error.response?.data?.error || "Analysis failed. Please try again.")
    } finally {
      setAnalysisLoading(false)
    }
  }

  const clearAnalysis = () => {
    setAnalysisResult(null)
    setAnalysisError("")
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-slate-800">
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-lg">
            <Upload className="h-5 w-5 text-white" />
          </div>
          Upload Datasheets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 group",
            isDragOver
              ? "border-cyan-400 bg-gradient-to-br from-cyan-50 to-emerald-50 scale-[1.02] shadow-lg"
              : "border-slate-300 hover:border-cyan-400 hover:bg-gradient-to-br hover:from-slate-50 hover:to-cyan-50/30 hover:shadow-md",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-100 to-emerald-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <FileSpreadsheet className="h-8 w-8 text-cyan-600" />
            </div>
            <div className="space-y-3">
              <p className="text-xl font-semibold text-slate-800">Drop your files here, or click to browse</p>
              <p className="text-slate-600">Supports Excel (.xlsx, .xls) and CSV files up to 10MB</p>
            </div>
            <Button
              onClick={() => document.getElementById("file-input")?.click()}
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white hover:from-cyan-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 text-lg font-medium"
            >
              Choose Files
            </Button>
            <input
              id="file-input"
              type="file"
              multiple
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {files.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-800 text-lg">Uploaded Files</h4>
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-800">{file.name}</span>
                    <div className="flex items-center gap-3">
                      {file.status === "completed" && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-emerald-500 animate-pulse" />
                          <span className="text-sm font-medium text-emerald-600">Complete</span>
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>{formatFileSize(file.size)}</span>
                    <span className="capitalize font-medium">{file.status}</span>
                  </div>
                  {file.status !== "completed" && (
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-300 ease-out"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* AI Analysis Section */}
            {selectedFile && (
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200/60">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-slate-800">AI Analysis</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    {analysisResult && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAnalysis}
                        className="text-slate-600 hover:text-red-500"
                      >
                        Clear Results
                      </Button>
                    )}
                    <Button
                      onClick={handleAIAnalysis}
                      disabled={analysisLoading}
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {analysisLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Brain className="h-4 w-4 mr-2" />
                          Analyze with AI
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {analysisError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {analysisError}
                  </div>
                )}

                {analysisResult && (
                  <div className="space-y-4">
                    {/* Analysis Summary */}
                    {analysisResult.analysis && (
                      <div className="p-4 bg-white rounded-lg border border-slate-200">
                        <h5 className="font-semibold text-slate-800 mb-2">Analysis Summary</h5>
                        <p className="text-slate-700 text-sm leading-relaxed">{analysisResult.analysis}</p>
                      </div>
                    )}

                    {/* Recommendations */}
                    {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
                      <div className="p-4 bg-white rounded-lg border border-slate-200">
                        <h5 className="font-semibold text-slate-800 mb-3">Recommendations</h5>
                        <ul className="space-y-2">
                          {analysisResult.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                              <span className="text-purple-500 mt-1">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Suggested Tables */}
                    {analysisResult.suggested_tables && analysisResult.suggested_tables.length > 0 && (
                      <div className="p-4 bg-white rounded-lg border border-slate-200">
                        <h5 className="font-semibold text-slate-800 mb-3">Suggested Tables</h5>
                        <div className="space-y-3">
                          {analysisResult.suggested_tables.map((table, index) => (
                            <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
                              <div className="bg-slate-50 px-3 py-2 border-b border-slate-200">
                                <h6 className="font-medium text-slate-800">{table.title}</h6>
                              </div>
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead className="bg-slate-50">
                                    <tr>
                                      {table.data[0]?.map((header, i) => (
                                        <th key={i} className="px-3 py-2 text-left font-medium text-slate-700">
                                          {header}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {table.data.slice(1).map((row, i) => (
                                      <tr key={i} className="border-t border-slate-200">
                                        {row.map((cell, j) => (
                                          <td key={j} className="px-3 py-2 text-slate-600">
                                            {cell}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggested Charts */}
                    {analysisResult.suggested_charts && analysisResult.suggested_charts.length > 0 && (
                      <div className="p-4 bg-white rounded-lg border border-slate-200">
                        <h5 className="font-semibold text-slate-800 mb-3">Suggested Charts</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {analysisResult.suggested_charts.map((chart, index) => (
                            <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
                              <div className="bg-slate-50 px-3 py-2 border-b border-slate-200">
                                <h6 className="font-medium text-slate-800">{chart.title}</h6>
                                <p className="text-xs text-slate-600">Type: {chart.type}</p>
                              </div>
                              <div className="p-3">
                                {chart.image_base64 ? (
                                  <img
                                    src={`data:image/png;base64,${chart.image_base64}`}
                                    alt={chart.title}
                                    className="w-full h-auto rounded"
                                  />
                                ) : (
                                  <div className="text-center py-4 text-slate-500 text-sm">
                                    Chart preview not available
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
