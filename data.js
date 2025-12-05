// Sample data structure matching your spreadsheet format
// You can replace this with your actual data from Excel/Google Sheets

const articlesData = [
    {
        timestamp: "2024-11-15 10:30:00",
        intervieweeName: "Sarah Chen",
        intervieweeCompany: "TechVision AI",
        publicistName: "Michael Roberts",
        publicistCompany: "PR Dynamics",
        topic: "Leadership & Innovation",
        intervieweeEmail: "sarah.chen@techvision.ai",
        publicistEmail: "michael@prdynamics.com",
        socialMedia: [
            { platform: "LinkedIn", url: "linkedin.com/in/sarahchen" },
            { platform: "Twitter", url: "twitter.com/sarahchen" }
        ],
        publishDate: "2024-12-01",
        authorityMagazineLink: "https://medium.com/authority-magazine/sarah-chen-interview",
        buzzfeedLink: "",
        status: "published",
        headshot: "https://i.pravatar.cc/300?img=1",
        actionShot: "https://i.pravatar.cc/400?img=1"
    },
    {
        timestamp: "2024-11-18 14:20:00",
        intervieweeName: "Dr. James Martinez",
        intervieweeCompany: "Global Health Initiative",
        publicistName: "Emily Thompson",
        publicistCompany: "Health Communications Group",
        topic: "Healthcare & Wellness",
        intervieweeEmail: "j.martinez@globalhealth.org",
        publicistEmail: "emily@healthcomms.com",
        socialMedia: [
            { platform: "LinkedIn", url: "linkedin.com/in/jamesmartinez" },
            { platform: "Instagram", url: "instagram.com/drjamesmartinez" }
        ],
        publishDate: "2024-12-05",
        authorityMagazineLink: "https://medium.com/authority-magazine/james-martinez-interview",
        buzzfeedLink: "https://buzzfeed.com/james-martinez",
        status: "published",
        headshot: "https://i.pravatar.cc/300?img=12",
        actionShot: "https://i.pravatar.cc/400?img=12"
    },
    {
        timestamp: "2024-11-20 09:15:00",
        intervieweeName: "Alexandra Rivera",
        intervieweeCompany: "EcoSolutions Inc",
        publicistName: "David Kim",
        publicistCompany: "Green PR Agency",
        topic: "Sustainability & Environment",
        intervieweeEmail: "alex.rivera@ecosolutions.com",
        publicistEmail: "david@greenpr.com",
        socialMedia: [
            { platform: "LinkedIn", url: "linkedin.com/in/alexandrarivera" },
            { platform: "Twitter", url: "twitter.com/alexrivera" },
            { platform: "Instagram", url: "instagram.com/alexrivera" }
        ],
        publishDate: "2024-12-10",
        authorityMagazineLink: "",
        buzzfeedLink: "",
        status: "pending",
        headshot: "https://i.pravatar.cc/300?img=5",
        actionShot: "https://i.pravatar.cc/400?img=5"
    },
    {
        timestamp: "2024-11-22 16:45:00",
        intervieweeName: "Marcus Johnson",
        intervieweeCompany: "FinTech Innovations",
        publicistName: "Lisa Anderson",
        publicistCompany: "Financial PR Partners",
        topic: "Finance & Technology",
        intervieweeEmail: "marcus.j@fintechinnovations.com",
        publicistEmail: "lisa@financialpr.com",
        socialMedia: [
            { platform: "LinkedIn", url: "linkedin.com/in/marcusjohnson" },
            { platform: "Twitter", url: "twitter.com/marcusj" }
        ],
        publishDate: "2024-12-08",
        authorityMagazineLink: "https://medium.com/authority-magazine/marcus-johnson-interview",
        buzzfeedLink: "",
        status: "published",
        headshot: "https://i.pravatar.cc/300?img=15",
        actionShot: "https://i.pravatar.cc/400?img=15"
    },
    {
        timestamp: "2024-11-25 11:30:00",
        intervieweeName: "Dr. Priya Patel",
        intervieweeCompany: "EdTech Revolution",
        publicistName: "Robert Williams",
        publicistCompany: "Education Media Group",
        topic: "Education & Learning",
        intervieweeEmail: "priya.patel@edtechrev.com",
        publicistEmail: "robert@edumedia.com",
        socialMedia: [
            { platform: "LinkedIn", url: "linkedin.com/in/priyapatel" },
            { platform: "YouTube", url: "youtube.com/@drpriyapatel" }
        ],
        publishDate: "2024-12-15",
        authorityMagazineLink: "",
        buzzfeedLink: "",
        status: "pending",
        headshot: "https://i.pravatar.cc/300?img=9",
        actionShot: "https://i.pravatar.cc/400?img=9"
    },
    {
        timestamp: "2024-11-27 13:00:00",
        intervieweeName: "Carlos Mendez",
        intervieweeCompany: "Creative Studios LA",
        publicistName: "Jennifer Lee",
        publicistCompany: "Entertainment PR Co",
        topic: "Arts & Entertainment",
        intervieweeEmail: "carlos@creativestudiosla.com",
        publicistEmail: "jennifer@entertainmentpr.com",
        socialMedia: [
            { platform: "Instagram", url: "instagram.com/carlosmendez" },
            { platform: "Twitter", url: "twitter.com/carlosm" },
            { platform: "TikTok", url: "tiktok.com/@carlosmendez" }
        ],
        publishDate: "2024-12-03",
        authorityMagazineLink: "https://medium.com/authority-magazine/carlos-mendez-interview",
        buzzfeedLink: "https://buzzfeed.com/carlos-mendez",
        status: "published",
        headshot: "https://i.pravatar.cc/300?img=33",
        actionShot: "https://i.pravatar.cc/400?img=33"
    }
];

// Extract unique topics for filter dropdown
const uniqueTopics = [...new Set(articlesData.map(article => article.topic))].sort();
