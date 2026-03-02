"""
Publish existing blogs and create sample blogs
"""
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.utils import timezone
from apps.blogs.models import Blog
from apps.accounts.models import AlumniProfile

User = get_user_model()

print("\n" + "="*80)
print("📝 PUBLISHING BLOGS")
print("="*80)

# Publish existing drafts
draft_blogs = Blog.objects.filter(status='draft')
print(f"\n📄 Found {draft_blogs.count()} draft blogs")

for blog in draft_blogs:
    blog.status = 'published'
    blog.published_at = timezone.now()
    blog.save()
    print(f"✅ Published: {blog.title}")

# Get verified alumni for authoring blogs
alumni_users = User.objects.filter(role='alumni', is_verified=True)

if not alumni_users.exists():
    print("\n⚠️  No verified alumni found to author blogs!")
else:
    # Create sample blogs
    sample_blogs = [
        {
            'title': 'From College to Career: My Journey at Google',
            'content': '''
# My Journey to Google

After graduating from VVIT in 2018, I embarked on an incredible journey that led me to Google. Here's what I learned along the way.

## The Beginning

During my final year, I focused heavily on:
- **Data Structures & Algorithms** - practiced 2 hours daily
- **System Design** - studied scalable architectures
- **Open Source Contributions** - contributed to 5+ projects

## The Interview Process

Google's interview was challenging but fair. Key tips:

1. **Practice coding problems** on LeetCode and HackerRank
2. **Understand time complexity** - every solution counts
3. **Communicate your thought process** - interviewers want to see how you think
4. **Ask clarifying questions** - don't assume requirements

## Life at Google

Working at Google has been amazing. The culture promotes innovation, learning, and work-life balance.

**Key Takeaways:**
- Never stop learning
- Build a strong network
- Focus on fundamentals
- Be patient and persistent

Feel free to reach out if you have questions about tech careers or interview preparation!
            ''',
            'category': 'Career',
            'tags': ['Career Advice', 'Tech Industry', 'Interview Tips', 'Google'],
            'author': User.objects.filter(email='vikram.joshi@vvit.net').first(),
        },
        {
            'title': 'Breaking into Product Management: Lessons from Amazon',
            'content': '''
# Breaking into Product Management

Transitioning from engineering to product management at Amazon was challenging but rewarding.

## Why Product Management?

I realized I loved:
- **Building products** that solve real problems  
- **Working with cross-functional teams**
- **Strategic thinking** and user empathy

## Key Skills for PM

1. **Communication** - You're the bridge between tech and business
2. **Data Analysis** - Every decision should be data-driven
3. **Technical Understanding** - You don't need to code, but understand architecture
4. **User Empathy** - Always put users first

## How to Get Started

- **Read**: "Inspired" by Marty Cagan, "Cracking the PM Interview"
- **Practice**: Write product specs for apps you use daily
- **Network**: Connect with PMs on LinkedIn
- **Side Projects**: Build something, even if small

## At Amazon

Working at Amazon taught me the importance of **customer obsession**. Every feature we build starts with the customer and works backwards.

**My advice**: Start where you are. Use what you have. Do what you can.

> "The best time to plant a tree was 20 years ago. The second best time is now."

Connect with me if you're interested in product management!
            ''',
            'category': 'Career',
            'tags': ['Product Management', 'Amazon', 'Career Transition', 'Tech Careers'],
            'author': User.objects.filter(email='pooja.menon@vvit.net').first(),
        },
        {
            'title': 'Top 10 Python Libraries Every Developer Should Know in 2026',
            'content': '''
# Top 10 Python Libraries for 2026

Python continues to dominate in web development, data science, and AI. Here are the must-know libraries.

## 1. FastAPI ⚡
The future of Python web frameworks. Faster than Flask, easier than Django.

```python
from fastapi import FastAPI
app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello World"}
```

## 2. Polars 📊
**10x faster** than Pandas for data manipulation.

## 3. LangChain 🤖
Build AI applications with LLMs easily.

## 4. Pydantic V2
Data validation that's actually fast.

## 5. Streamlit
Turn scripts into shareable web apps in minutes.

## 6. Apache Airflow
Orchestrate your data pipelines like a pro.

## 7. Typer
Build beautiful CLI apps with Python type hints.

## 8. SQLModel
SQL databases in Python, designed for FastAPI.

## 9. Playwright
Modern web automation and testing.

## 10. Rich
Make your terminal output beautiful.

## Conclusion

Stay updated with these libraries. They're not just trendy - they solve real problems efficiently.

**Pro tip**: Don't learn everything. Master what you need, stay aware of the rest.

Questions? Drop a comment below!
            ''',
            'category': 'Technology',
            'tags': ['Python', 'Programming', 'Software Development', 'Tech Stack'],
            'author': User.objects.filter(email='aditya.verma@vvit.net').first(),
        },
        {
            'title': 'Importance of Internships: How They Shaped My Career',
            'content': '''
# Why Internships Matter

Internships aren't just about adding lines to your resume - they're about discovering what you love (and don't love) about work.

## My Internship Journey

### First Internship (Summer 2nd Year)
- **Company**: Local startup
- **Role**: Web Development Intern
- **Learning**: Basics of professional coding, Git, code reviews

### Second Internship (Summer 3rd Year)  
- **Company**: Microsoft (through campus placement)
- **Role**: Software Engineering Intern
- **Learning**: Enterprise development, testing, agile methodology

### What I Gained

1. **Real-world experience** - Classwork != Real projects
2. **Networking** - Many of my colleagues are now in top companies
3. **Clarity** - Understood what role I wanted

## How to Get Internships

### Build Projects
GitHub is your resume. Build 2-3 solid projects.

### Apply Early
Don't wait for campus placements. Apply directly to companies.

### Leverage LinkedIn
Connect with alumni, engage with their content, ask for referrals.

### Practice Interviews
Mock interviews with friends helped me immensely.

## Internship → Full-time

My Microsoft internship led to a full-time offer. **70% of interns** get return offers if they perform well.

## For Juniors

- Start early (2nd year if possible)
- Don't be afraid of rejection
- Every internship teaches something valuable
- Remote internships are great too

Feel free to DM me if you need internship advice or resume reviews!

---

**Remember**: Your first internship doesn't have to be at a big company. Any experience is valuable experience.
            ''',
            'category': 'Career',
            'tags': ['Internships', 'Career Advice', 'Student Tips', 'Professional Development'],
            'author': User.objects.filter(email='neha.kapoor@vvit.net').first(),
        },
        {
            'title': 'System Design Fundamentals: A Beginner\'s Guide',
            'content': '''
# System Design Fundamentals

System design interviews are scary for many candidates. Let's break it down.

## What is System Design?

Designing scalable, reliable, and maintainable systems to solve real-world problems.

## Core Concepts

### 1. Scalability
**Horizontal vs Vertical Scaling**
- Vertical: Add more power (CPU, RAM) to existing machine
- Horizontal: Add more machines

**When to scale horizontally?**
- Need high availability
- Cost-effective for large scale
- Easier to maintain

### 2. Load Balancing
Distribute incoming requests across multiple servers.

**Popular algorithms:**
- Round Robin
- Least Connections
- IP Hash

### 3. Caching
Store frequently accessed data in memory for faster retrieval.

**Caching strategies:**
- **Cache-aside**: Application checks cache, then database
- **Write-through**: Write to cache and database simultaneously
- **Write-back**: Write to cache, async write to database

### 4. Database Sharding
Partition data across multiple databases.

**Sharding strategies:**
- Range-based
- Hash-based
- Geography-based

### 5. Message Queues
Decouple services using queues like RabbitMQ, Kafka.

**Benefits:**
- Async processing
- Better fault tolerance
- Easier scaling

## Common System Design Questions

1. Design URL Shortener (like bit.ly)
2. Design Instagram
3. Design WhatsApp
4. Design Netflix
5. Design Uber

## How to Approach

1. **Clarify requirements** - Functional & Non-functional
2. **Estimate scale** - Users, requests per second, storage
3. **High-level design** - Draw boxes and arrows
4. **Deep dive** - Database schema, APIs, algorithms
5. **Identify bottlenecks** - Optimize for scale

## Resources

- **Book**: "Designing Data-Intensive Applications" by Martin Kleppmann
- **YouTube**: System Design Interview channel
- **Practice**: ByteByteGo, Exponent

## Final Thoughts

System design is learned through practice. Start with small systems, understand trade-offs, and gradually tackle complex problems.

**Pro tip**: There's no "perfect" design. Be ready to justify your choices and discuss trade-offs.

Questions? Let's discuss in the comments! 🚀
            ''',
            'category': 'Technology',
            'tags': ['System Design', 'Software Engineering', 'Scalability', 'Architecture'],
            'author': User.objects.filter(email='rohit.das@vvit.net').first(),
        },
    ]
    
    created_count = 0
    for blog_data in sample_blogs:
        author = blog_data.pop('author')
        if not author:
            print(f"⚠️  Skipping blog (no author): {blog_data['title']}")
            continue
        
        # Check if blog already exists
        if Blog.objects.filter(title=blog_data['title']).exists():
            print(f"⏭️  Skipping (already exists): {blog_data['title']}")
            continue
        
        blog = Blog.objects.create(
            author=author,
            status='published',
            published_at=timezone.now(),
            **blog_data
        )
        created_count += 1
        print(f"✅ Created: {blog.title} by {author.full_name}")

    print(f"\n{'='*80}")
    print(f"✅ Published {draft_blogs.count()} draft blogs")
    print(f"✅ Created {created_count} new blogs")
    print(f"\n📊 Total published blogs: {Blog.objects.filter(status='published').count()}")
    print(f"{'='*80}\n")
