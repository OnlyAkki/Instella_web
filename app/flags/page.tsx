import { getFlagCategories } from "@/lib/flags"
import Footer from "@/components/footer"
import FlagsClient from "./flags-client"

export default async function FlagsPage() {
  console.log("FlagsPage: Fetching flag categories...")

  try {
    const categories = await getFlagCategories()
    console.log("FlagsPage: Categories fetched:", categories)

    return (
      <div className="flex flex-col min-h-screen">
        <FlagsClient categories={categories} />
        <Footer />
      </div>
    )
  } catch (error) {
    console.error("FlagsPage: Error fetching categories:", error)

    return (
      <div className="flex flex-col min-h-screen">
        <FlagsClient categories={[]} />
        <Footer />
      </div>
    )
  }
}
