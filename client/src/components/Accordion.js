import AccordionItem from "./AccordionItem";

function Accordion() {
  const accordionData = [
    {
      title: "What’s the difference between subscriptions?",
      content:
        "VisionVault comes in two subscriptions, Hobbyist and Professional. For Hobbyists, it is completely free antttd your usage in idea generation per day is limited along with community engagement. However, for Professionals, everything is unlimited.",
    },
    {
      title: "How many ideas can I generate?",
      content: "3 per week for Hobbyists and 20 per week for Professionals.",
    },
    {
      title: "How do I share my ideas?",
      content:
        "You can share your ideas by clicking the share button on an idea and sending it to a community you are a member of.",
    },
    {
      title: "How do I find a specific community",
      content:
        "You can find a specific community by searching for related tags in the search bar. If it a community does not exist, you can create it yourself",
    },
  ];

  console.log(accordionData);
  return (
    <div className="w-full h-full flex flex-col justify-center mb-40 z-10">
      {accordionData.map((item, index) => {
        // Let's log to see if the data is being read correctly
        return <AccordionItem title={item.title} content={item.content} />;
      })}
    </div>
  );
}

export default Accordion;
