import Footer from "@/components/footer"
import BackupsClient from "./backups-client"

export default function BackupsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <BackupsClient backups={[]} />
      <Footer />
    </div>
  )
}
