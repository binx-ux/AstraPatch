# AstraPatch

AstraPatch is a real-time space exploration monitoring system that provides comprehensive tracking of rocket launches, solar activity, and astronomical imagery. Built with a cyberpunk aesthetic and modern web technologies, the platform aggregates data from multiple space agencies and scientific organizations to deliver an immersive experience for space enthusiasts and researchers.

## Features

### Rocket Launch Tracking
The launch tracking system pulls real-time data from The Space Devs API to display upcoming launches from major space agencies and private companies. Each launch card includes mission details, provider information, launch location, rocket specifications, and a live countdown timer. Users can filter launches by provider including SpaceX, NASA, and other agencies to focus on specific missions of interest.

### Solar Activity Monitoring
AstraPatch monitors solar events through NASA's DONKI API, tracking three critical categories of space weather activity. The solar flare tracker displays recent X-ray emissions from the sun with classification and peak time information. The coronal mass ejection monitor shows explosive solar material releases that can impact Earth's magnetosphere. The geomagnetic storm tracker provides updates on disturbances in Earth's magnetic field caused by solar activity, including Kp index measurements.

### Astronomy Picture of the Day
Daily astronomy imagery and explanations are sourced directly from NASA's APOD API. The system displays high-resolution space photography and videos with detailed scientific descriptions, providing educational content alongside stunning visuals from telescopes and spacecraft around the world.

### Technical Implementation
The interface is built with vanilla JavaScript and modern CSS including flexbox and grid layouts for responsive design. The animated starfield background creates an immersive space environment while maintaining performance. The platform fetches data from multiple APIs including The Space Devs for launch information, NASA DONKI for solar events, and NASA APOD for daily imagery.

The countdown system updates in real-time for all upcoming launches, calculating days, hours, minutes, and seconds until liftoff. Filter controls allow users to sort launches by provider with smooth transitions. The responsive grid layout adapts to different screen sizes while maintaining visual hierarchy and readability.

## Data Sources

Launch data is provided by The Space Devs Launch Library 2 API, which aggregates information from space agencies worldwide. Solar activity data comes from NASA's Space Weather Database of Notifications, Knowledge, Information (DONKI) API. Daily astronomy content is sourced from NASA's Astronomy Picture of the Day service.

## Setup Instructions

Clone the repository to your local machine. No build process or dependencies are required as the project uses vanilla JavaScript and CSS. Simply open the index.html file in a modern web browser to run the application locally. For deployment, upload all files to any static hosting service such as GitHub Pages, Netlify, or Vercel.

## Browser Compatibility

AstraPatch is designed for modern browsers that support ES6+ JavaScript, CSS Grid, and Flexbox. The application works best in Chrome, Firefox, Safari, and Edge. Internet Explorer is not supported due to lack of modern JavaScript and CSS features.

## API Usage

The application uses publicly available APIs with demo keys for testing. For production deployment, consider registering for your own API keys from NASA and The Space Devs to avoid rate limiting. The NASA API key can be obtained at api.nasa.gov. The Space Devs API is free for non-commercial use with reasonable rate limits.

## Performance Considerations

API requests are made on page load and cached in the browser. The starfield animation uses CSS transforms for smooth performance. Images are loaded lazily to reduce initial page load time. The countdown timers update every second using requestAnimationFrame for optimal performance.

## Future Enhancements

Planned features include real-time notifications for upcoming launches, integration with additional space agencies and private companies, historical launch data with search and filtering capabilities, interactive 3D visualizations of orbital mechanics, and user accounts for saving favorite missions and customizing alerts.

## Contributing

Contributions are welcome for bug fixes, feature additions, and documentation improvements. Please ensure code follows the existing style and test thoroughly before submitting pull requests.

## License

This project is open source and available for educational and non-commercial use. Space imagery and data remain property of their respective sources including NASA and The Space Devs.

## Credits

Built by Binxix for space enthusiasts worldwide. Launch data provided by The Space Devs. Solar activity data from NASA DONKI. Astronomy imagery from NASA APOD.
