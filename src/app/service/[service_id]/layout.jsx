export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  console.log("METADATA PARAMS:", resolvedParams);

  const id = Number(resolvedParams.service_id);

  const services = {
    1: {
      title: "Baby Sitting",
      description:
        "Professional baby sitting service with trained and trusted caregivers.",
      image:
        "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=1200&q=80",
    },
    2: {
      title: "Elderly Care",
      description:
        "Compassionate elderly care services ensuring comfort and dignity.",
      image:
        "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=1200&q=80",
    },
    3: {
      title: "Sick People Care",
      description:
        "Professional home care services for sick patients and recovery support.",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&q=80",
    },
    4: {
      title: "Disability Care",
      description:
        "Dedicated disability care services focused on independence and safety.",
      image:
        "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=1200&q=80",
    },
    5: {
      title: "Overnight Care",
      description: "24/7 overnight care service for peace of mind and safety.",
      image:
        "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1200&q=80",
    },
    6: {
      title: "Companion Care",
      description:
        "Companion care service providing emotional support and companionship.",
      image:
        "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=1200&q=80",
    },
  };

  const service = services[id];

  if (!service) {
    return {
      title: "Service Not Found | CareNest",
    };
  }

  return {
    title: `${service.title} | Book Professional Care`,
    description: service.description,
    openGraph: {
      title: `${service.title} | CareNest`,
      description: service.description,
      url: `http://localhost:3000/service/${id}`,
      siteName: "CareNest",
      images: [
        {
          url: service.image,
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.title} | CareNest`,
      description: service.description,
      images: [service.image],
    },
  };
}

export default function ServiceLayout({ children }) {
  return <>{children}</>;
}
