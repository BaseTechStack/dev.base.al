import{_ as a,c as i,o as n,ag as e}from"./chunks/framework.BgId8OS5.js";const c=JSON.parse('{"title":"Base Command Line Tool","description":"","frontmatter":{"title":"Base Command Line Tool"},"headers":[],"relativePath":"projects/base/cmd.md","filePath":"projects/base/cmd.md","lastUpdated":1748626538000}'),l={name:"projects/base/cmd.md"};function t(p,s,h,k,r,o){return n(),i("div",null,s[0]||(s[0]=[e(`<h1 id="base-command-line-tool" tabindex="-1">Base - Command Line Tool <a class="header-anchor" href="#base-command-line-tool" aria-label="Permalink to &quot;Base - Command Line Tool&quot;">​</a></h1><p>Base CLI is a powerful command-line tool designed to streamline development with the Base framework. It offers scaffolding, module generation, and utilities to accelerate Go application development.</p><h2 id="installation-usage" tabindex="-1">Installation &amp; Usage <a class="header-anchor" href="#installation-usage" aria-label="Permalink to &quot;Installation &amp; Usage&quot;">​</a></h2><p>Install Base CLI with a single command:</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -sSL</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://raw.githubusercontent.com/base-go/cmd/main/install.sh</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> bash</span></span></code></pre></div><h2 id="available-commands" tabindex="-1">Available Commands <a class="header-anchor" href="#available-commands" aria-label="Permalink to &quot;Available Commands&quot;">​</a></h2><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Create a new project</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">base</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> new</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> myapp</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Start development server with base start or base s for short</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">base</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> start</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">base</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> s</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Start development server with hot reload and generate swagger docs</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">base</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> s</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -d</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -r</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Generate modules with base generate command or base g for short</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">base</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> g</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> post</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> title:string</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> content:text</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> published:bool</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Generate with relationships and attachments</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">base</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> g</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> post</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  title:string</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  content:text</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  featured_image:image</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  gallery:attachment</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  author:belongsTo:User</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  comments:hasMany:Comment</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Generate with specialized attachments</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">base</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> g</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> document</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  title:string</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  file:file</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">          # Document attachment with validation</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  author:belongsTo:User</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Remove modules with base destroy command or base d for short</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">base</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> d</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> post</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Update framework</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">base</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> update</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   # Update Core directory to latest version</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">base</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> upgrade</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  # Upgrade CLI to latest version</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Other commands</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">base</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> version</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  # Show version information</span></span></code></pre></div><h2 id="create-a-new-project" tabindex="-1">Create a New Project <a class="header-anchor" href="#create-a-new-project" aria-label="Permalink to &quot;Create a New Project&quot;">​</a></h2><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Create a new project</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">base</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> new</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> myapp</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">cd</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> myapp</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Start the development server with hot reload</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">base</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> start</span></span></code></pre></div><p>Your API will be available at <a href="http://localhost:8080" target="_blank" rel="noreferrer">http://localhost:8080</a></p><h2 id="configuration" tabindex="-1">Configuration <a class="header-anchor" href="#configuration" aria-label="Permalink to &quot;Configuration&quot;">​</a></h2><p>Base uses environment variables for configuration. A .env file is automatically created with your new project:</p><div class="language-env vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">env</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SERVER_ADDRESS=:8080</span></span>
<span class="line"><span>JWT_SECRET=your_jwt_secret</span></span>
<span class="line"><span>API_KEY=your_api_key</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Database</span></span>
<span class="line"><span>DB_HOST=localhost</span></span>
<span class="line"><span>DB_PORT=5432</span></span>
<span class="line"><span>DB_NAME=myapp</span></span>
<span class="line"><span>DB_USER=postgres</span></span>
<span class="line"><span>DB_PASSWORD=postgres</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Storage</span></span>
<span class="line"><span>STORAGE_DRIVER=local  # local, s3, r2</span></span>
<span class="line"><span>STORAGE_PATH=storage</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Email</span></span>
<span class="line"><span>MAIL_DRIVER=smtp     # smtp, sendgrid, postmark</span></span>
<span class="line"><span>MAIL_HOST=smtp.mailtrap.io</span></span>
<span class="line"><span>MAIL_PORT=2525</span></span>
<span class="line"><span>MAIL_USERNAME=username</span></span>
<span class="line"><span>MAIL_PASSWORD=password</span></span></code></pre></div><h2 id="project-structure" tabindex="-1">Project Structure <a class="header-anchor" href="#project-structure" aria-label="Permalink to &quot;Project Structure&quot;">​</a></h2><p>Base follows a modular architecture with a centralized models directory:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>.</span></span>
<span class="line"><span>├── app/</span></span>
<span class="line"><span>│   ├── models/            # All models in one place</span></span>
<span class="line"><span>│   │   ├── post.go       # Post model with GORM tags</span></span>
<span class="line"><span>│   │   ├── user.go       # User model</span></span>
<span class="line"><span>│   │   └── comment.go    # Comment model</span></span>
<span class="line"><span>│   ├── posts/            # Post module</span></span>
<span class="line"><span>│   │   ├── controller.go # HTTP handlers &amp; file upload</span></span>
<span class="line"><span>│   │   ├── service.go    # Business logic &amp; storage</span></span>
<span class="line"><span>│   │   └── module.go     # Module registration</span></span>
<span class="line"><span>│   ├── users/            # User module</span></span>
<span class="line"><span>│   │   ├── controller.go</span></span>
<span class="line"><span>│   │   ├── service.go</span></span>
<span class="line"><span>│   │   └── module.go</span></span>
<span class="line"><span>│   └── init.go           # Module initialization</span></span>
<span class="line"><span>├── core/                 # Framework core</span></span>
<span class="line"><span>│   ├── storage/         # File storage system</span></span>
<span class="line"><span>│   ├── logger/          # Structured logging</span></span>
<span class="line"><span>│   └── emitter/         # Event system</span></span>
<span class="line"><span>├── storage/              # File storage directory</span></span>
<span class="line"><span>├── .env                  # Environment config</span></span>
<span class="line"><span>└── main.go              # Entry point</span></span></code></pre></div><h2 id="module-generation" tabindex="-1">Module Generation <a class="header-anchor" href="#module-generation" aria-label="Permalink to &quot;Module Generation&quot;">​</a></h2><p>When you generate a new module:</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Generate a post module</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">base</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> g</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> post</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> title:string</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> content:text</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Creates:</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">app/</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">├──</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> models/</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">│</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   └──</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> post.go</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">         # Post model with GORM tags</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">└──</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> posts/</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">              # Post module</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    ├──</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> controller.go</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   # HTTP handlers &amp; validation</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    ├──</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> service.go</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      # Business logic</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    └──</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> module.go</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">       # Module registration</span></span></code></pre></div><h2 id="field-types" tabindex="-1">Field Types <a class="header-anchor" href="#field-types" aria-label="Permalink to &quot;Field Types&quot;">​</a></h2><p>Base supports various field types for model generation:</p><h3 id="basic-types" tabindex="-1">Basic Types: <a class="header-anchor" href="#basic-types" aria-label="Permalink to &quot;Basic Types:&quot;">​</a></h3><ul><li><code>string</code>: String field</li><li><code>int</code>: Integer field</li><li><code>bool</code>: Boolean field</li><li><code>float</code>: Float field</li><li><code>text</code>: Text field (for longer strings)</li></ul><h3 id="special-types" tabindex="-1">Special Types: <a class="header-anchor" href="#special-types" aria-label="Permalink to &quot;Special Types:&quot;">​</a></h3><ul><li><code>image</code>: Image attachment with validation (5MB limit, image extensions)</li><li><code>file</code>: File attachment with validation (50MB limit, document extensions)</li><li><code>attachment</code>: Generic attachment (10MB limit, mixed extensions)</li><li><code>time</code>: Time field</li><li><code>date</code>: Date field</li><li><code>datetime</code>: DateTime field</li></ul><h3 id="relationship-types" tabindex="-1">Relationship Types: <a class="header-anchor" href="#relationship-types" aria-label="Permalink to &quot;Relationship Types:&quot;">​</a></h3><ul><li><code>belongs_to</code>: One-to-one relationship (with foreign key in this model)</li><li><code>has_one</code>: One-to-one relationship (with foreign key in the other model)</li><li><code>has_many</code>: One-to-many relationship</li></ul><h2 id="example-building-a-blog-system" tabindex="-1">Example: Building a Blog System <a class="header-anchor" href="#example-building-a-blog-system" aria-label="Permalink to &quot;Example: Building a Blog System&quot;">​</a></h2><p>Here&#39;s a comprehensive example of building a blog system with categories, posts, tags, and comments:</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Generate Category model</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">base</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> g</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Category</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  name:string</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  description:text</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  image:attachment</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  parent:belongsTo:Category</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  posts:hasMany:Post</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Generate Post model</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">base</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> g</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Post</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  title:string</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  content:text</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  excerpt:text</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  featured_image:attachment</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  gallery:attachment</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  published_at:datetime</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  author:belongsTo:users.User</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  category:belongsTo:Category</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  comments:hasMany:Comment</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Generate Tag model</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">base</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> g</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Tag</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  name:string</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  slug:string</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Generate Comment model</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">base</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> g</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Comment</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  content:text</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  author:belongsTo:users.User</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  post:belongsTo:Post</span></span></code></pre></div><p>This will create:</p><ul><li>Full CRUD operations for all models</li><li>RESTful API endpoints with Swagger documentation</li><li>File upload handling for images</li><li>Proper relationships and preloading</li><li>Authentication and authorization integration</li></ul><h2 id="license" tabindex="-1">License <a class="header-anchor" href="#license" aria-label="Permalink to &quot;License&quot;">​</a></h2><p>Base CLI is licensed under the MIT License. See the LICENSE file for details.</p><h2 id="links" tabindex="-1">Links <a class="header-anchor" href="#links" aria-label="Permalink to &quot;Links&quot;">​</a></h2><ul><li><a href="https://github.com/BaseTechStack/cmd" target="_blank" rel="noreferrer">GitHub Repository</a></li><li><a href="./index.html">Base Framework</a></li></ul>`,36)]))}const F=a(l,[["render",t]]);export{c as __pageData,F as default};
