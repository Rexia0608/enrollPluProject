import React from "react";
import {
  Target,
  BookOpen,
  Briefcase,
  HeartHandshake,
  Sparkles,
  Rocket,
  TrendingUp,
  Users,
  Award,
} from "lucide-react";
import Card from "../components/ui/Card";
import PrimaryButton from "../components/ui/PrimaryButton";
import Navbar from "../components/school/Navbar";
import HeroSection from "../components/school/heroSection";
import OfferSection from "../components/school/offerSection";
import Footer from "../components/school/footer";

const LSTCLandingPage = () => {
  const objectives = [
    {
      icon: HeartHandshake,
      title: "Holistic Development",
      description:
        "Provide individuals with opportunities to become God-fearing, self-disciplined, and highly skilled.",
    },
    {
      icon: Users,
      title: "Strategic Collaboration",
      description:
        "Collaborate with government and private entities to meet current and future labor market demands.",
    },
    {
      icon: Briefcase,
      title: "Employment Partnerships",
      description:
        "Strengthen partnerships that support employment opportunities for graduates.",
    },
    {
      icon: TrendingUp,
      title: "Entrepreneurship Promotion",
      description:
        "Promote entrepreneurship through technical and vocational education programs.",
    },
  ];

  const whyChoose = [
    {
      icon: Award,
      title: "Industry-aligned Programs",
      description:
        "Technical and vocational programs designed to meet current industry standards and demands.",
    },
    {
      icon: Rocket,
      title: "Focus on Employability",
      description:
        "Strong emphasis on job readiness and entrepreneurial skills for career success.",
    },
    {
      icon: Users,
      title: "Strong Industry Linkages",
      description:
        "Established partnerships with leading companies for internships and job placement.",
    },
    {
      icon: Sparkles,
      title: "Holistic Development",
      description:
        "Balanced formation of skills, values, and discipline for well-rounded professionals.",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-white to-gray-50">
      {/* Navbar */}
      <Navbar />
      {/* Hero Section */}
      <HeroSection />

      {/* Vision & Mission */}
      <section id="vision" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="h-full hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 rounded-xl p-3">
                  <Target className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Vision
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    Laguna Science and Technology College envisions itself as a
                    growing institution of learning and developing individuals
                    technically, technologically, and professionally—thus
                    becoming useful citizens of the nation contributing to its
                    greatness.
                  </p>
                </div>
              </div>
            </Card>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 rounded-xl p-3">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Mission
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    To train young men and women to become productive citizens
                    fully equipped with rightful skills and values that the
                    modern industries demand.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Objectives
            </h2>
            <p className="text-gray-600">
              Guided by our commitment to excellence, we pursue these key
              objectives to empower our students and community.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {objectives.map((obj, idx) => (
              <Card
                key={idx}
                className="hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-blue-100 rounded-full p-3 mb-4">
                    <obj.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {obj.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{obj.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer + Programs */}
      <OfferSection />
      {/* Why Choose LSTC */}
      <section id="why" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose LSTC?
            </h2>
            <p className="text-gray-600">
              Discover what makes Laguna Science and Technology College the
              premier choice for technical and vocational education.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChoose.map((item, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-all group">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-green-500 rounded-full p-3 mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Build Your Future?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join LSTC today and take the first step toward a successful career
            in technology and skills development.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <PrimaryButton
              size="lg"
              className="bg-green-500 text-shadow-white hover:bg-green-300"
            >
              Enroll Now
            </PrimaryButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LSTCLandingPage;
