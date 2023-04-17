import Header from "@/components/Header";
import Layout from "@/layouts";
import LeaderBoard from "@/components/LeaderBoard";
import MatchHistory from "@/components/MatchHistory";

Home.getLayout = (page: any) => <Layout>{page}</Layout>
export default function Home() {
  return (
      <div className="flex gap-3 md:flex-wrap lg:flex-nowrap">
        <LeaderBoard />
        <MatchHistory />
      </div>
  )
}
