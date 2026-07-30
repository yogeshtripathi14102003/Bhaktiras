import HeroBanner from "@/components/home/HeroBanner";
import LiveStreamingSection from "@/components/home/LiveStreamingSection";
import LatestBhajans from "@/components/home/LatestBhajans";
import LatestKathas from "@/components/home/LatestKathas";
import FeaturedSaints from "@/components/home/FeaturedSaints";
import DailyQuote from "@/components/home/DailyQuote";
import FestivalCountdown from "@/components/home/FestivalCountdown";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import LatestBlogs from "@/components/home/LatestBlogs";
import DonationCTA from "@/components/home/DonationCTA";
import PhotoGallery from "@/components/home/PhotoGallery";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <LiveStreamingSection />
      <LatestBhajans />
      <LatestKathas />
      <FeaturedSaints />
      <DailyQuote />
      <FestivalCountdown />
      <UpcomingEvents />
      <LatestBlogs />
      <DonationCTA />
      <PhotoGallery />
      <Testimonials />
      <Newsletter />
    </>
  );
}
