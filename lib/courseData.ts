export type Lesson = {
  id: string;
  title: string;
  theory: string;
  example: string;
  taskInstruction: string;
  starterCode: string;
  expectedOutput: string;
  xpReward: number;
  coinReward: number;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  color: string;
  lessons: Lesson[];
};

// ═══════════════════════════════════════════════════════
// HTML COURSE — Complete from zero to professional
// ═══════════════════════════════════════════════════════
const htmlLessons: Lesson[] = [
  // ── Section 1: Basics ──
  {
    id: 'html-01', title: 'What is HTML?',
    theory: 'HTML stands for HyperText Markup Language. It is the standard language for creating web pages. HTML describes the structure of a web page using elements represented by tags like <h1>, <p>, <div>.',
    example: `<!DOCTYPE html>\n<html>\n<head>\n  <title>My First Page</title>\n</head>\n<body>\n  <h1>Hello World!</h1>\n</body>\n</html>`,
    taskInstruction: 'Create a complete HTML page with a title "My Page" and an <h1> heading that says "Hello CodeRift!".',
    starterCode: `<!DOCTYPE html>\n<html>\n<head>\n  <title></title>\n</head>\n<body>\n  \n</body>\n</html>`,
    expectedOutput: 'Hello CodeRift!', xpReward: 30, coinReward: 3,
  },
  {
    id: 'html-02', title: 'Headings',
    theory: 'HTML has 6 heading levels: <h1> (largest, most important) through <h6> (smallest). Use headings to create a document hierarchy. Each page should have exactly one <h1>.',
    example: `<h1>Main Title</h1>\n<h2>Subtitle</h2>\n<h3>Section</h3>\n<h4>Subsection</h4>`,
    taskInstruction: 'Create an <h1> with "Welcome" and an <h2> with "Getting Started".',
    starterCode: `<body>\n  \n</body>`,
    expectedOutput: '<h2>Getting Started</h2>', xpReward: 30, coinReward: 3,
  },
  {
    id: 'html-03', title: 'Paragraphs & Line Breaks',
    theory: 'The <p> tag defines a paragraph with automatic spacing. The <br> tag inserts a line break within text. HTML ignores extra whitespace — use these tags to control text layout.',
    example: `<p>This is the first paragraph.</p>\n<p>This is the second paragraph.</p>\n<p>Line one<br>Line two</p>`,
    taskInstruction: 'Create two paragraphs. First: "HTML is easy." Second: "Let\'s learn together."',
    starterCode: `<body>\n  \n</body>`,
    expectedOutput: "Let's learn together.", xpReward: 30, coinReward: 3,
  },
  {
    id: 'html-04', title: 'Text Formatting',
    theory: '<strong> makes text bold (important), <em> makes it italic (emphasis), <u> underlines, <s> strikethrough, <mark> highlights, <small> makes text smaller, <sub> subscript, <sup> superscript.',
    example: `<p><strong>Bold text</strong></p>\n<p><em>Italic text</em></p>\n<p><mark>Highlighted</mark></p>\n<p>H<sub>2</sub>O and x<sup>2</sup></p>`,
    taskInstruction: 'Create a paragraph with the word "important" in bold and "emphasis" in italic.',
    starterCode: `<body>\n  <p></p>\n</body>`,
    expectedOutput: '<strong>', xpReward: 40, coinReward: 4,
  },
  {
    id: 'html-05', title: 'Comments',
    theory: 'HTML comments are invisible to users but help developers. They start with <!-- and end with -->. Use them to explain code, temporarily disable elements, or leave notes.',
    example: `<!-- This is a comment -->\n<p>Visible text</p>\n<!-- <p>This is hidden</p> -->`,
    taskInstruction: 'Add a comment that says "TODO: Add navigation" above a paragraph that says "Welcome".',
    starterCode: `<body>\n  \n</body>`,
    expectedOutput: '<!-- TODO: Add navigation -->', xpReward: 30, coinReward: 3,
  },

  // ── Section 2: Links & Media ──
  {
    id: 'html-06', title: 'Links (Anchors)',
    theory: 'The <a> tag creates hyperlinks. The href attribute specifies the destination URL. Use target="_blank" to open in a new tab. Relative links point to pages within your site.',
    example: `<a href="https://google.com">Google</a>\n<a href="https://github.com" target="_blank">GitHub (new tab)</a>\n<a href="/about">About Page</a>`,
    taskInstruction: 'Create a link to "https://coderift.dev" with text "Visit CodeRift" that opens in a new tab.',
    starterCode: `<body>\n  \n</body>`,
    expectedOutput: 'target="_blank"', xpReward: 40, coinReward: 4,
  },
  {
    id: 'html-07', title: 'Images',
    theory: 'The <img> tag embeds images. Required: src (image URL) and alt (description for accessibility). Optional: width, height, loading="lazy" for performance. <img> is self-closing.',
    example: `<img src="photo.jpg" alt="A sunset" width="400">\n<img src="logo.png" alt="Company Logo" loading="lazy">`,
    taskInstruction: 'Add an image with src="hero.jpg", alt="Hero Banner", and width="600".',
    starterCode: `<body>\n  \n</body>`,
    expectedOutput: 'alt="Hero Banner"', xpReward: 40, coinReward: 4,
  },
  {
    id: 'html-08', title: 'Audio & Video',
    theory: 'The <video> tag embeds video with controls, autoplay, loop attributes. <audio> works similarly. Use <source> inside for multiple formats. Always provide fallback text.',
    example: `<video width="640" controls>\n  <source src="movie.mp4" type="video/mp4">\n  Your browser does not support video.\n</video>\n\n<audio controls>\n  <source src="song.mp3" type="audio/mpeg">\n</audio>`,
    taskInstruction: 'Create a video element with controls, width 500, and a source "intro.mp4" of type "video/mp4".',
    starterCode: `<body>\n  \n</body>`,
    expectedOutput: '<video', xpReward: 50, coinReward: 5,
  },

  // ── Section 3: Lists ──
  {
    id: 'html-09', title: 'Unordered Lists',
    theory: 'The <ul> tag creates a bulleted list. Each item is wrapped in <li>. Lists can be nested inside other lists. CSS can change the bullet style.',
    example: `<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n</ul>`,
    taskInstruction: 'Create an unordered list with items: "Learn", "Build", "Deploy".',
    starterCode: `<body>\n  \n</body>`,
    expectedOutput: '<li>Build</li>', xpReward: 40, coinReward: 4,
  },
  {
    id: 'html-10', title: 'Ordered & Description Lists',
    theory: '<ol> creates a numbered list. Use type="A" for letters, type="I" for Roman numerals. <dl> creates a description list with <dt> (term) and <dd> (description) pairs.',
    example: `<ol type="1">\n  <li>First step</li>\n  <li>Second step</li>\n</ol>\n\n<dl>\n  <dt>HTML</dt>\n  <dd>Markup language for web</dd>\n</dl>`,
    taskInstruction: 'Create an ordered list with 3 steps: "Open editor", "Write code", "Save file".',
    starterCode: `<body>\n  \n</body>`,
    expectedOutput: '<ol>', xpReward: 40, coinReward: 4,
  },

  // ── Section 4: Tables ──
  {
    id: 'html-11', title: 'Basic Tables',
    theory: '<table> creates a table. <tr> is a row, <th> is a header cell (bold+centered), <td> is a data cell. Structure: table > thead > tr > th for headers, table > tbody > tr > td for data.',
    example: `<table>\n  <thead>\n    <tr>\n      <th>Name</th>\n      <th>Age</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Alice</td>\n      <td>25</td>\n    </tr>\n  </tbody>\n</table>`,
    taskInstruction: 'Create a table with headers "Language" and "Level", and one row: "HTML", "Beginner".',
    starterCode: `<body>\n  <table>\n    \n  </table>\n</body>`,
    expectedOutput: '<th>Language</th>', xpReward: 60, coinReward: 6,
  },
  {
    id: 'html-12', title: 'Table Spanning & Caption',
    theory: 'colspan makes a cell span multiple columns. rowspan spans multiple rows. <caption> adds a title above the table. <colgroup> and <col> style entire columns.',
    example: `<table>\n  <caption>Student Grades</caption>\n  <tr>\n    <th colspan="2">Full Name</th>\n    <th>Grade</th>\n  </tr>\n  <tr>\n    <td>John</td>\n    <td>Doe</td>\n    <td rowspan="2">A</td>\n  </tr>\n</table>`,
    taskInstruction: 'Create a table with a caption "Schedule" and a header row where the first cell spans 2 columns with text "Time Slot".',
    starterCode: `<body>\n  <table>\n    \n  </table>\n</body>`,
    expectedOutput: 'colspan="2"', xpReward: 60, coinReward: 6,
  },

  // ── Section 5: Forms ──
  {
    id: 'html-13', title: 'Basic Forms',
    theory: '<form> wraps form elements. action specifies where data is sent, method is GET or POST. <input> creates various input types. <label> provides accessible text linked via for/id.',
    example: `<form action="/submit" method="POST">\n  <label for="name">Name:</label>\n  <input type="text" id="name" name="name">\n  <button type="submit">Send</button>\n</form>`,
    taskInstruction: 'Create a form with a text input for "username" with a label, and a submit button saying "Register".',
    starterCode: `<body>\n  <form>\n    \n  </form>\n</body>`,
    expectedOutput: '<label', xpReward: 60, coinReward: 6,
  },
  {
    id: 'html-14', title: 'Input Types',
    theory: 'HTML5 input types: text, password, email, number, tel, url, date, time, color, range, file, checkbox, radio, hidden, search. Each provides built-in validation and UI.',
    example: `<input type="email" placeholder="you@mail.com" required>\n<input type="number" min="0" max="100">\n<input type="date">\n<input type="color" value="#ff0000">\n<input type="range" min="0" max="100">`,
    taskInstruction: 'Create an email input with placeholder "Enter email", a password input, and a date input. All required.',
    starterCode: `<form>\n  \n</form>`,
    expectedOutput: 'type="email"', xpReward: 60, coinReward: 6,
  },
  {
    id: 'html-15', title: 'Select, Textarea & Fieldset',
    theory: '<select> creates a dropdown with <option> items. <textarea> creates a multi-line text input with rows/cols. <fieldset> groups form elements with <legend> as a title.',
    example: `<fieldset>\n  <legend>Preferences</legend>\n  <select name="lang">\n    <option value="en">English</option>\n    <option value="hu">Hungarian</option>\n  </select>\n  <textarea rows="4" cols="50" placeholder="Your message..."></textarea>\n</fieldset>`,
    taskInstruction: 'Create a fieldset with legend "Contact", containing a select dropdown with options "Email" and "Phone", and a textarea.',
    starterCode: `<form>\n  \n</form>`,
    expectedOutput: '<fieldset>', xpReward: 70, coinReward: 7,
  },

  // ── Section 6: Semantic HTML5 ──
  {
    id: 'html-16', title: 'Semantic Structure',
    theory: 'Semantic HTML5 elements describe meaning: <header> (top section), <nav> (navigation), <main> (primary content), <footer> (bottom). They improve accessibility and SEO over generic <div>.',
    example: `<header>\n  <h1>My Website</h1>\n  <nav>\n    <a href="/">Home</a>\n    <a href="/about">About</a>\n  </nav>\n</header>\n<main>\n  <p>Welcome!</p>\n</main>\n<footer>\n  <p>&copy; 2024</p>\n</footer>`,
    taskInstruction: 'Create a page structure with <header> containing an <h1> and <nav>, <main> with a paragraph, and <footer>.',
    starterCode: `<body>\n  \n</body>`,
    expectedOutput: '<main>', xpReward: 70, coinReward: 7,
  },
  {
    id: 'html-17', title: 'Article, Section & Aside',
    theory: '<article> is self-contained content (blog post, product card). <section> groups related content with a heading. <aside> is side content (sidebar, callout). These nest inside <main>.',
    example: `<main>\n  <article>\n    <h2>Blog Post Title</h2>\n    <p>Article content...</p>\n  </article>\n  <aside>\n    <h3>Related Links</h3>\n    <ul><li>Link 1</li></ul>\n  </aside>\n</main>`,
    taskInstruction: 'Create a <main> with an <article> containing an h2 "My Post" and paragraph, plus an <aside> with an h3 "Tips".',
    starterCode: `<body>\n  \n</body>`,
    expectedOutput: '<article>', xpReward: 70, coinReward: 7,
  },
  {
    id: 'html-18', title: 'Figure & Details',
    theory: '<figure> wraps media with <figcaption> for a caption — used for images, diagrams, code blocks. <details> creates a collapsible section with <summary> as the visible toggle.',
    example: `<figure>\n  <img src="chart.png" alt="Sales chart">\n  <figcaption>Q4 2024 Sales</figcaption>\n</figure>\n\n<details>\n  <summary>Click to expand</summary>\n  <p>Hidden content here...</p>\n</details>`,
    taskInstruction: 'Create a <figure> with an image and figcaption "Project Screenshot", and a <details> with summary "More Info".',
    starterCode: `<body>\n  \n</body>`,
    expectedOutput: '<figcaption>', xpReward: 70, coinReward: 7,
  },

  // ── Section 7: Head & Meta ──
  {
    id: 'html-19', title: 'The Head Element',
    theory: '<head> contains metadata, not visible content. <title> sets the browser tab text. <meta charset="UTF-8"> sets encoding. <meta name="viewport"> enables responsive design. <link> connects CSS.',
    example: `<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>My Site</title>\n  <link rel="stylesheet" href="style.css">\n</head>`,
    taskInstruction: 'Create a complete <head> with charset UTF-8, viewport meta tag, title "CodeRift App", and a link to "style.css".',
    starterCode: `<head>\n  \n</head>`,
    expectedOutput: 'viewport', xpReward: 60, coinReward: 6,
  },
  {
    id: 'html-20', title: 'SEO & Open Graph Meta Tags',
    theory: '<meta name="description"> helps search engines. Open Graph tags (og:title, og:description, og:image) control how your page appears when shared on social media.',
    example: `<meta name="description" content="Learn coding with AI">\n<meta name="keywords" content="coding, learn, HTML">\n<meta property="og:title" content="CodeRift">\n<meta property="og:description" content="AI coding platform">\n<meta property="og:image" content="preview.jpg">`,
    taskInstruction: 'Add a meta description "Best coding platform" and an og:title "CodeRift" and og:image "banner.jpg".',
    starterCode: `<head>\n  <meta charset="UTF-8">\n  <title>CodeRift</title>\n  \n</head>`,
    expectedOutput: 'og:title', xpReward: 70, coinReward: 7,
  },

  // ── Section 8: Advanced ──
  {
    id: 'html-21', title: 'IFrames & Embeds',
    theory: '<iframe> embeds another webpage inside your page. Use it for YouTube videos, maps, external widgets. Set width, height, and allow attributes for permissions. Always add a title for accessibility.',
    example: `<iframe\n  src="https://www.youtube.com/embed/dQw4w9WgXcQ"\n  width="560" height="315"\n  title="Video player"\n  allow="accelerometer; autoplay"\n  allowfullscreen\n></iframe>`,
    taskInstruction: 'Create an iframe embedding "https://example.com" with width 800, height 600, and title "External Site".',
    starterCode: `<body>\n  \n</body>`,
    expectedOutput: '<iframe', xpReward: 60, coinReward: 6,
  },
  {
    id: 'html-22', title: 'Accessibility (A11y)',
    theory: 'Accessible HTML: always use alt on images, label on inputs, semantic tags, ARIA roles (role="navigation"), aria-label for screen readers, tabindex for keyboard navigation, lang on <html>.',
    example: `<html lang="en">\n<nav role="navigation" aria-label="Main menu">\n  <a href="/">Home</a>\n</nav>\n<img src="logo.png" alt="Company Logo">\n<button aria-label="Close dialog">X</button>`,
    taskInstruction: 'Create a <nav> with role="navigation" and aria-label="Site navigation", containing 3 links.',
    starterCode: `<body>\n  \n</body>`,
    expectedOutput: 'aria-label', xpReward: 80, coinReward: 8,
  },
  {
    id: 'html-23', title: 'Data Attributes & Templates',
    theory: 'data-* attributes store custom data on elements (data-id, data-color). Access in JS via element.dataset. <template> holds markup not rendered until cloned with JavaScript.',
    example: `<div data-user-id="42" data-role="admin">\n  User Card\n</div>\n\n<template id="card-template">\n  <div class="card">\n    <h3></h3>\n    <p></p>\n  </div>\n</template>`,
    taskInstruction: 'Create a <div> with data-product-id="101" and data-category="electronics", plus a <template> with id "item-tmpl".',
    starterCode: `<body>\n  \n</body>`,
    expectedOutput: 'data-product-id', xpReward: 80, coinReward: 8,
  },
  {
    id: 'html-24', title: 'Complete Page Project',
    theory: 'A professional HTML page combines everything: DOCTYPE, semantic structure, meta tags, navigation, main content with articles, forms, tables, images, and a footer. This is your final challenge!',
    example: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Portfolio</title>\n</head>\n<body>\n  <header>\n    <nav><a href="#about">About</a></nav>\n  </header>\n  <main>\n    <section id="about">\n      <h1>My Portfolio</h1>\n    </section>\n  </main>\n  <footer><p>&copy; 2024</p></footer>\n</body>\n</html>`,
    taskInstruction: 'Build a complete portfolio page with: DOCTYPE, lang, meta viewport, <header> with <nav>, <main> with <section> and <h1>, and a <footer>. Include at least one link and one paragraph.',
    starterCode: `<!DOCTYPE html>\n<html>\n<head>\n  \n</head>\n<body>\n  \n</body>\n</html>`,
    expectedOutput: '<footer>', xpReward: 150, coinReward: 15,
  },
];

// ═══════════════════════════════════════════════════════
// CSS COURSE
// ═══════════════════════════════════════════════════════
const cssLessons: Lesson[] = [
  { id: 'css-01', title: 'CSS Basics', theory: 'CSS controls the visual presentation of HTML. A CSS rule has a selector and declaration block with property:value pairs separated by semicolons.', example: `h1 {\n  color: blue;\n  font-size: 24px;\n}`, taskInstruction: 'Write a CSS rule that makes all <p> elements have red color and font-size 18px.', starterCode: `/* Style the paragraphs */\np {\n  \n}`, expectedOutput: 'color: red', xpReward: 50, coinReward: 5 },
  { id: 'css-02', title: 'Box Model', theory: 'Every element is a box: content, padding, border, margin. Padding is inside, margin is outside. Use box-sizing: border-box to simplify sizing.', example: `.box {\n  width: 200px;\n  padding: 20px;\n  border: 2px solid black;\n  margin: 10px;\n  box-sizing: border-box;\n}`, taskInstruction: 'Create a .card class with 300px width, 16px padding, 1px solid gray border, and box-sizing border-box.', starterCode: `.card {\n  \n}`, expectedOutput: 'box-sizing', xpReward: 60, coinReward: 6 },
  { id: 'css-03', title: 'Flexbox Layout', theory: 'display: flex on a container enables flexible layout. Use justify-content for horizontal alignment, align-items for vertical, gap for spacing.', example: `.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 16px;\n}`, taskInstruction: 'Create a .nav class using flexbox with space-between justification and 12px gap.', starterCode: `.nav {\n  \n}`, expectedOutput: 'display: flex', xpReward: 80, coinReward: 8 },
  { id: 'css-04', title: 'CSS Grid', theory: 'CSS Grid is a 2D layout system. grid-template-columns defines column sizes. Use fr units for fractions, auto-fit for responsive grids, gap for spacing.', example: `.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n}`, taskInstruction: 'Create a .gallery class with CSS Grid, 4 equal columns, and 16px gap.', starterCode: `.gallery {\n  \n}`, expectedOutput: 'display: grid', xpReward: 80, coinReward: 8 },
  { id: 'css-05', title: 'Responsive Design', theory: 'Media queries apply styles at specific screen sizes. Mobile-first: start small, add complexity. Use min-width for larger screens, max-width for smaller.', example: `@media (min-width: 768px) {\n  .container {\n    max-width: 720px;\n  }\n}`, taskInstruction: 'Write a media query that changes .sidebar width to 250px on screens wider than 1024px.', starterCode: `/* Add your media query */\n`, expectedOutput: '@media', xpReward: 100, coinReward: 10 },
];

// ═══════════════════════════════════════════════════════
// JAVASCRIPT COURSE
// ═══════════════════════════════════════════════════════
const jsLessons: Lesson[] = [
  { id: 'js-01', title: 'Variables & Types', theory: 'let (reassignable), const (constant), var (legacy). Types: string, number, boolean, array, object, null, undefined.', example: `const name = "CodeRift";\nlet score = 100;\nconst isActive = true;\nconst skills = ["HTML", "CSS", "JS"];`, taskInstruction: 'Create a const "greeting" with "Hello World" and a let "count" with value 0.', starterCode: `// Declare your variables\n`, expectedOutput: 'const greeting', xpReward: 50, coinReward: 5 },
  { id: 'js-02', title: 'Functions', theory: 'Functions are reusable code blocks. Arrow functions (=>) are modern. Functions accept parameters and return values.', example: `const add = (a, b) => a + b;\n\nfunction greet(name) {\n  return "Hello, " + name;\n}`, taskInstruction: 'Create an arrow function "double" that takes a number and returns it multiplied by 2.', starterCode: `// Create the double function\n`, expectedOutput: 'const double', xpReward: 75, coinReward: 8 },
  { id: 'js-03', title: 'Arrays & Loops', theory: '.map() transforms, .filter() selects, .reduce() accumulates, .forEach() iterates. For...of loops through values.', example: `const nums = [1, 2, 3, 4, 5];\nconst doubled = nums.map(n => n * 2);\nconst evens = nums.filter(n => n % 2 === 0);`, taskInstruction: 'Given [10, 20, 30, 40, 50], use .filter() to keep only numbers greater than 25.', starterCode: `const numbers = [10, 20, 30, 40, 50];\nconst result = `, expectedOutput: '.filter(', xpReward: 100, coinReward: 10 },
  { id: 'js-04', title: 'Objects & Destructuring', theory: 'Objects store key-value pairs. Destructuring extracts values. Spread operator (...) copies/merges objects.', example: `const user = { name: "Akos", level: 5 };\nconst { name, level } = user;\nconst updated = { ...user, level: 6 };`, taskInstruction: 'Create object "player" with name, score, level. Destructure name and score.', starterCode: `// Create player and destructure\n`, expectedOutput: 'const { name, score }', xpReward: 100, coinReward: 10 },
  { id: 'js-05', title: 'DOM Manipulation', theory: 'querySelector finds elements, textContent changes text, addEventListener handles events, classList modifies CSS classes.', example: `const btn = document.querySelector("#myBtn");\nbtn.addEventListener("click", () => {\n  document.querySelector("h1").textContent = "Clicked!";\n});`, taskInstruction: 'Select element with id "output" and set its textContent to "Hello from JS!".', starterCode: `// Select and change text\n`, expectedOutput: 'querySelector', xpReward: 100, coinReward: 10 },
];

export const courses: Course[] = [
  {
    id: 'html',
    title: 'HTML Fundamentals',
    description: 'Learn the building blocks of every website — from basic tags to professional page structure',
    icon: '🌐',
    difficulty: 'Beginner',
    color: 'from-orange-500 to-red-500',
    lessons: htmlLessons,
  },
  {
    id: 'css',
    title: 'CSS Styling',
    description: 'Make your websites beautiful with layouts, colors, and responsive design',
    icon: '🎨',
    difficulty: 'Beginner',
    color: 'from-blue-500 to-purple-500',
    lessons: cssLessons,
  },
  {
    id: 'javascript',
    title: 'JavaScript Essentials',
    description: 'Add interactivity and logic to your websites',
    icon: '⚡',
    difficulty: 'Intermediate',
    color: 'from-yellow-500 to-amber-500',
    lessons: jsLessons,
  },
];

export function getCourse(courseId: string): Course | undefined {
  return courses.find((c) => c.id === courseId);
}

export function getLesson(courseId: string, lessonId: string): Lesson | undefined {
  return getCourse(courseId)?.lessons.find((l) => l.id === lessonId);
}
