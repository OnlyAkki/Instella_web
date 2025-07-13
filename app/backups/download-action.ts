"use server"

/**
 * Server Action to download a file from a given URL.
 * It fetches the file and returns it with a Content-Disposition header
 * to force a download in the browser.
 * @param fileUrl The URL of the file to download.
 * @param suggestedFileName An optional suggested filename for the download.
 */
export async function downloadFile(fileUrl: string, suggestedFileName?: string) {
  console.log(`[Server Action] downloadFile: Initiated for URL: ${fileUrl}, suggestedFileName: ${suggestedFileName}`)
  try {
    const response = await fetch(fileUrl, {
      // Ensure revalidation is not too aggressive if the file changes frequently
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(
        `[Server Action] downloadFile: Failed to fetch file from ${fileUrl}. Status: ${response.status} ${response.statusText}. Body: ${errorText}`,
      )
      return new Response(`Failed to download file: ${response.statusText}`, { status: response.status })
    }

    // Defensive check: Ensure response.body is not null
    if (!response.body) {
      console.error(`[Server Action] downloadFile: Response body is null for URL: ${fileUrl}`)
      return new Response("File content not available.", { status: 500 })
    }

    // Determine filename
    let filename = suggestedFileName
    if (!filename) {
      // Try to extract filename from URL
      const urlParts = fileUrl.split("/")
      filename = urlParts[urlParts.length - 1]
      // Remove any query parameters from filename
      if (filename.includes("?")) {
        filename = filename.split("?")[0]
      }
    }

    // Get content type from original response, or default to application/octet-stream
    const contentType = response.headers.get("Content-Type") || "application/octet-stream"

    console.log(
      `[Server Action] downloadFile: Successfully fetched file. Preparing response for filename: "${filename}", Content-Type: "${contentType}"`,
    )

    // Create a new Response to send back to the client with download headers
    // Crucially, we pass the original response.body directly to stream the file.
    return new Response(response.body, {
      headers: {
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type": contentType,
        // Optionally, add other headers like Content-Length if known
        "Content-Length": response.headers.get("Content-Length") || undefined,
      },
    })
  } catch (error: any) {
    console.error(`[Server Action] downloadFile: Caught unexpected error during file download for ${fileUrl}:`, error)
    return new Response(`Internal Server Error: ${error.message || "Unknown error"}`, { status: 500 })
  }
}
