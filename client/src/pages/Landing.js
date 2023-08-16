import React, { useEffect } from "react";
import { Link, Navigate } from "react-router-dom"; // Import Link and Redirect from react-router-dom
import axios from "axios"; // Import axios
import { useAuth } from "../context/AuthContext";
import InfoTabs from "../components/InfoTabs";
import FakeCommunityCard from "../components/FakeCommunityCard";
import ReviewCard from "../components/ReviewCard";
import Accordion from "../components/Accordion";
import Logo from "../components/Logo";

const Landing = () => {
  const { isAuthenticated, handleAuthentication } = useAuth();

  useEffect(() => {
    // Make an API call to check if the user is authenticated
    axios
      .get("/auth/ensure", { withCredentials: true })
      .then((response) => {
        handleAuthentication(response.data.isAuthenticated);
      })
      .catch((error) => {
        console.error("Error checking authentication:", error);
      });
  }, [isAuthenticated, handleAuthentication]);

  return (
    <div>
      {/* Redirect to Dashboard if authenticated */}
      {isAuthenticated && <Navigate to="/dashboard" />}
      <div className="bg-black Landing-Section flex flex-row">
        <div className="w-full h-full relative">
          <Logo></Logo>
          <div className="absolute top-1/3 left-[10%] z-10 w-5/12">
            <h1 className="text-7xl">Create new ideas from nothing</h1>
            <p>
              Having trouble with new ideas for your next Youtube video? Is
              reaching out to different content creators difficult for you?
              VisionVault has you covered.
            </p>
            <Link to="/signup">
              <button className="bg-yellow-200 text-black hover:bg-sky-700 hover:text-white mt-10">
                Sign Up Now
              </button>
            </Link>
          </div>
        </div>

        <div className="w-7/12 h-full right-0 bg-white overflow-hidden absolute">
          <img
            className="object-cover"
            src="https://images.unsplash.com/photo-1605089103010-bcba7ca9b10d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80"
          ></img>
        </div>
      </div>

      <div className="bg-sky-700 w-full Landing-Section flex flex-col items-center">
        <h2 className="mt-20 text-center">Inspiration Engine</h2>
        <p className="mt-4 text-center w-1/3">
          Leverage the power of artificial intelligence to create unique ideas
          personalized for your content.
        </p>
        <InfoTabs></InfoTabs>
      </div>

      <div className="bg-sky-700 w-full Landing-Section flex">
        <div className="w-1/2">
          <div className="mt-24 ml-32 ">
            <FakeCommunityCard
              communityName={"Shroom Zone"}
              communityPicture={
                "https://plus.unsplash.com/premium_photo-1691960547805-7143654bd06b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHx8&auto=format&fit=crop&w=600&q=60"
              }
              tags={"mushrooms mycelium music shrooms mystical"}
              description={
                "A community for content creators that make mushroom music. Post some of your interesting ideas for mushroom music here!"
              }
            ></FakeCommunityCard>
          </div>
          <div className="mt-72 ml-8">
            <FakeCommunityCard
              communityName={"Digital Visionaries"}
              communityPicture={
                "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGlnaXRhbCUyMGFydHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60"
              }
              tags={
                "digitalart animationmasters graphicdesign digitalcollab visionarycreations"
              }
              description={
                "A community dedicated to digital content creators who thrive in the realms of animation, graphics design, and digital art. Join to share, learn, and collaborate with fellow artists on groundbreaking projects."
              }
            ></FakeCommunityCard>
          </div>
          <div className="mt-108 ml-64">
            <FakeCommunityCard
              communityName={"Vloggers' Hub"}
              communityPicture={
                "https://images.unsplash.com/photo-1615860729622-61affadb11f2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dmxvZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60"
              }
              tags={
                "vloglife storytellers dailyadventures lifeoncamera vloggertips"
              }
              description={
                "The ultimate destination for vloggers and lifestyle creators. Share your daily adventures, exchange tips on storytelling, and connect with vloggers from all corners of the world."
              }
            ></FakeCommunityCard>
          </div>
        </div>

        <div className="w-1/2 flex flex-col justify-center">
          <h2>Discover new communities</h2>
          <p className="">
            Reach out to other content creators easily through our public
            communities. Create private communities for smaller discussions and
            share your ideas with others.
          </p>
        </div>
      </div>
      <div className="bg-sky-700 w-full Landing-Section flex items-center justify-center">
        <div className="grid mt-32 grid-cols-3 gap-x-20 p-10 h-full">
          <ReviewCard
            profilePicture={
              "https://images.unsplash.com/photo-1509773896068-7fd415d91e2e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bmlnaHQlMjBza3l8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60"
            }
            userName={"LunarLandscapes"}
            rating={5}
            reviewText={
              "Before VisionVault, creating new ideas for videos was a major struggle. Finding and analyzing content to create new ideas was often too time consuming and fruitless. Now, I can simply create new ideas with a press of a button!"
            }
          ></ReviewCard>
          <ReviewCard
            profilePicture={
              "https://images.unsplash.com/photo-1533711539834-ebcee9ed4975?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80"
            }
            userName={"BeatStreetJax"}
            rating={5}
            reviewText={
              "Not only has VisionVault been helpful in creative pursuits, it has also helped me connect with other aspiring content creators. I now have much more exposure to the Youtube space."
            }
          ></ReviewCard>
          <ReviewCard
            profilePicture={
              "https://images.unsplash.com/photo-1666374832858-353a79bd8094?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2lybCUyMHdpdGglMjBwbGFudHN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60"
            }
            userName={"GreenThumbAria"}
            rating={5}
            reviewText={
              "At first I was skeptical. VisionVault just sounds like a ChatGPT clone, but boy was I surprised. While other platforms like VidIQ failed in finding inspiration, VisionVault succeeded in growing my ideas to greater visions."
            }
          ></ReviewCard>
        </div>
      </div>
      <div className="bg-sky-700 w-full Landing-Section flex flex-row items-center p-32">
        <h2 className="w-1/3 text-6xl mb-96">Frequently asked questions</h2>
        <div className="w-2/3 h-full flex items-center">
          <Accordion />
        </div>
      </div>
      <div className="bg-sky-700 w-full pb-64 flex flex-col items-center">
        <h2 className="text-center">Start creating now!</h2>
        <Link to="/signup">
          <button className="bg-gray-800 mt-10 w-64 py-3">Sign Up</button>
        </Link>
      </div>
      <footer className="bg-black h-16 w-full flex justify-evenly items-center">
        <p>2023 VisualVault</p>
        <p>Terms of Service</p>
        <p>Privacy Policy</p>
      </footer>
    </div>
  );
};

export default Landing;
