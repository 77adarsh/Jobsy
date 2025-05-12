import { useState, useEffect } from 'react';

export default function JobCategories() {
  // State to track the currently selected category
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Job categories data
  const jobCategories = [
    {
      id: 'web-developer',
      title: 'Web Developer',
      description: 'Lorem ipsum is simply dummy text of the printing and industry Lorem ipsum has been'
    },
    {
      id: 'ui-designer',
      title: 'UI Designer',
      description: 'Lorem ipsum is simply dummy text of the printing and industry Lorem ipsum has been'
    },
    {
      id: 'project-management',
      title: 'Project Management',
      description: 'Lorem ipsum is simply dummy text of the printing and industry Lorem ipsum has been'
    },
    {
      id: 'business-consulting',
      title: 'Business Consulting',
      description: 'Lorem ipsum is simply dummy text of the printing and industry Lorem ipsum has been'
    },
    {
      id: 'finance-management',
      title: 'Finance Management',
      description: 'Lorem ipsum is simply dummy text of the printing and industry Lorem ipsum has been'
    },
    {
      id: 'product-designer',
      title: 'Product Designer',
      description: 'Lorem ipsum is simply dummy text of the printing and industry Lorem ipsum has been'
    }
  ];

  // Effect to check for category in URL on component mount
  useEffect(() => {
    // Get the category from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, []);

  // Handle category selection
  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    
    // Update URL with the selected category
    const url = new URL(window.location);
    url.searchParams.set('category', categoryId);
    window.history.pushState({}, '', url);
    
    // Scroll to job listings or relevant section
    // In a real app, you might want to navigate to a different page or fetch data
    document.getElementById('job-categories').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-16" id="job-categories">
      <h2 className="text-3xl font-bold text-center mb-12">Job Category</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobCategories.map((category) => (
          <div 
            key={category.id}
            className={`p-6 rounded-lg cursor-pointer transition-colors duration-300 
              ${selectedCategory === category.id ? 
                'bg-blue-600 text-white' : 
                'bg-gray-100 text-gray-800 hover:bg-blue-600 hover:text-white'}`}
            onClick={() => handleCategoryClick(category.id)}
          >
            <h3 className="text-xl font-semibold mb-4">{category.title}</h3>
            <p className={`text-sm ${selectedCategory === category.id ? 'opacity-90' : 'text-gray-600 group-hover:text-white'}`}>
              {category.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}