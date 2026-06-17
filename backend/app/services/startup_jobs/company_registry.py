from typing import Dict, List, Optional
from .types import StartupProfile, StartupStage, IndustryCategory, RemotePolicy


class StartupCompanyRegistry:
    """Registry of high-growth startups and their information"""
    
    DREAM_COMPANIES: Dict[str, StartupProfile] = {
        "openai": StartupProfile(
            name="OpenAI",
            logo_url="https://logo.clearbit.com/openai.com",
            website="https://openai.com",
            careers_url="https://openai.com/careers",
            stage=StartupStage.SERIES_C,
            funding_amount=11_000_000_000,
            team_size=500,
            remote_policy=RemotePolicy.HYBRID,
            industries=[IndustryCategory.AI_ML],
            tech_stack=["Python", "PyTorch", "Kubernetes", "React"],
            founded_year=2015,
            is_yc_company=True,
            locations=["San Francisco, CA"]
        ),
        "anthropic": StartupProfile(
            name="Anthropic",
            logo_url="https://logo.clearbit.com/anthropic.com",
            website="https://anthropic.com",
            careers_url="https://anthropic.com/careers",
            stage=StartupStage.SERIES_C,
            funding_amount=7_300_000_000,
            team_size=300,
            remote_policy=RemotePolicy.HYBRID,
            industries=[IndustryCategory.AI_ML],
            tech_stack=["Python", "PyTorch", "TypeScript", "React"],
            founded_year=2021,
            locations=["San Francisco, CA", "New York, NY"]
        ),
        "perplexity": StartupProfile(
            name="Perplexity",
            logo_url="https://logo.clearbit.com/perplexity.ai",
            website="https://perplexity.ai",
            careers_url="https://perplexity.ai/careers",
            stage=StartupStage.SERIES_B,
            funding_amount=165_000_000,
            team_size=80,
            remote_policy=RemotePolicy.REMOTE_FIRST,
            industries=[IndustryCategory.AI_ML],
            tech_stack=["Python", "React", "TypeScript", "PostgreSQL"],
            founded_year=2022,
            locations=["San Francisco, CA"]
        ),
        "cursor": StartupProfile(
            name="Cursor",
            logo_url="https://logo.clearbit.com/cursor.sh",
            website="https://cursor.sh",
            careers_url="https://cursor.sh/careers",
            stage=StartupStage.SEED,
            team_size=20,
            remote_policy=RemotePolicy.REMOTE_FIRST,
            industries=[IndustryCategory.AI_ML, IndustryCategory.DEVELOPER_TOOLS],
            tech_stack=["TypeScript", "React", "Python"],
            founded_year=2023,
            locations=["San Francisco, CA"]
        ),
        "windsurf": StartupProfile(
            name="Windsurf",
            logo_url="https://logo.clearbit.com/codeium.com",
            website="https://codeium.com/windsurf",
            careers_url="https://codeium.com/careers",
            stage=StartupStage.SERIES_B,
            team_size=50,
            remote_policy=RemotePolicy.REMOTE_FIRST,
            industries=[IndustryCategory.AI_ML, IndustryCategory.DEVELOPER_TOOLS],
            tech_stack=["TypeScript", "Python", "Rust"],
            founded_year=2021,
            locations=["Mountain View, CA"]
        ),
        "lovable": StartupProfile(
            name="Lovable",
            logo_url="https://logo.clearbit.com/lovable.dev",
            website="https://lovable.dev",
            careers_url="https://lovable.dev/careers",
            stage=StartupStage.SEED,
            team_size=15,
            remote_policy=RemotePolicy.FULLY_REMOTE,
            industries=[IndustryCategory.AI_ML, IndustryCategory.DEVELOPER_TOOLS],
            tech_stack=["TypeScript", "React", "Python"],
            founded_year=2023,
            locations=["Remote"]
        ),
        "bolt": StartupProfile(
            name="Bolt",
            logo_url="https://logo.clearbit.com/bolt.new",
            website="https://bolt.new",
            careers_url="https://bolt.new/careers",
            stage=StartupStage.SEED,
            team_size=12,
            remote_policy=RemotePolicy.FULLY_REMOTE,
            industries=[IndustryCategory.AI_ML, IndustryCategory.DEVELOPER_TOOLS],
            tech_stack=["TypeScript", "React", "Python"],
            founded_year=2024,
            locations=["Remote"]
        ),
        "replit": StartupProfile(
            name="Replit",
            logo_url="https://logo.clearbit.com/replit.com",
            website="https://replit.com",
            careers_url="https://replit.com/site/careers",
            stage=StartupStage.SERIES_B,
            funding_amount=200_000_000,
            team_size=120,
            remote_policy=RemotePolicy.FULLY_REMOTE,
            industries=[IndustryCategory.DEVELOPER_TOOLS, IndustryCategory.EDTECH],
            tech_stack=["JavaScript", "Python", "Go", "React"],
            founded_year=2016,
            locations=["Remote"]
        ),
        "vercel": StartupProfile(
            name="Vercel",
            logo_url="https://logo.clearbit.com/vercel.com",
            website="https://vercel.com",
            careers_url="https://vercel.com/careers",
            stage=StartupStage.SERIES_D_PLUS,
            funding_amount=313_000_000,
            team_size=250,
            remote_policy=RemotePolicy.REMOTE_FIRST,
            industries=[IndustryCategory.DEVELOPER_TOOLS, IndustryCategory.SAAS],
            tech_stack=["TypeScript", "React", "Next.js", "Node.js"],
            founded_year=2015,
            locations=["San Francisco, CA"]
        ),
        "supabase": StartupProfile(
            name="Supabase",
            logo_url="https://logo.clearbit.com/supabase.com",
            website="https://supabase.com",
            careers_url="https://supabase.com/careers",
            stage=StartupStage.SERIES_B,
            funding_amount=116_000_000,
            team_size=80,
            remote_policy=RemotePolicy.FULLY_REMOTE,
            industries=[IndustryCategory.DEVELOPER_TOOLS, IndustryCategory.OPEN_SOURCE],
            tech_stack=["TypeScript", "PostgreSQL", "Elixir", "React"],
            founded_year=2020,
            is_yc_company=True,
            locations=["Remote"]
        ),
        "neon": StartupProfile(
            name="Neon",
            logo_url="https://logo.clearbit.com/neon.tech",
            website="https://neon.tech",
            careers_url="https://neon.tech/careers",
            stage=StartupStage.SERIES_B,
            funding_amount=104_000_000,
            team_size=60,
            remote_policy=RemotePolicy.REMOTE_FIRST,
            industries=[IndustryCategory.DEVELOPER_TOOLS, IndustryCategory.SAAS],
            tech_stack=["Rust", "PostgreSQL", "TypeScript", "React"],
            founded_year=2021,
            locations=["San Francisco, CA"]
        ),
        "cloudflare": StartupProfile(
            name="Cloudflare",
            logo_url="https://logo.clearbit.com/cloudflare.com",
            website="https://cloudflare.com",
            careers_url="https://cloudflare.com/careers",
            stage=StartupStage.PUBLIC,
            team_size=3500,
            remote_policy=RemotePolicy.HYBRID,
            industries=[IndustryCategory.CYBERSECURITY, IndustryCategory.SAAS],
            tech_stack=["Go", "Rust", "TypeScript", "React"],
            founded_year=2009,
            locations=["San Francisco, CA", "Austin, TX", "London, UK"]
        ),
        "stripe": StartupProfile(
            name="Stripe",
            logo_url="https://logo.clearbit.com/stripe.com",
            website="https://stripe.com",
            careers_url="https://stripe.com/jobs",
            stage=StartupStage.PUBLIC,
            funding_amount=2_200_000_000,
            team_size=8000,
            remote_policy=RemotePolicy.HYBRID,
            industries=[IndustryCategory.FINTECH, IndustryCategory.SAAS],
            tech_stack=["Ruby", "Go", "JavaScript", "React"],
            founded_year=2010,
            locations=["San Francisco, CA", "Seattle, WA", "Dublin, IE"]
        ),
        "linear": StartupProfile(
            name="Linear",
            logo_url="https://logo.clearbit.com/linear.app",
            website="https://linear.app",
            careers_url="https://linear.app/careers",
            stage=StartupStage.SERIES_B,
            funding_amount=52_000_000,
            team_size=70,
            remote_policy=RemotePolicy.FULLY_REMOTE,
            industries=[IndustryCategory.SAAS, IndustryCategory.DEVELOPER_TOOLS],
            tech_stack=["TypeScript", "React", "Node.js", "PostgreSQL"],
            founded_year=2019,
            locations=["Remote"]
        ),
        "notion": StartupProfile(
            name="Notion",
            logo_url="https://logo.clearbit.com/notion.so",
            website="https://notion.so",
            careers_url="https://notion.so/careers",
            stage=StartupStage.SERIES_C,
            funding_amount=343_000_000,
            team_size=400,
            remote_policy=RemotePolicy.HYBRID,
            industries=[IndustryCategory.SAAS],
            tech_stack=["TypeScript", "React", "Go", "PostgreSQL"],
            founded_year=2016,
            locations=["San Francisco, CA", "New York, NY"]
        ),
        "figma": StartupProfile(
            name="Figma",
            logo_url="https://logo.clearbit.com/figma.com",
            website="https://figma.com",
            careers_url="https://figma.com/careers",
            stage=StartupStage.SERIES_D_PLUS,
            funding_amount=733_000_000,
            team_size=1000,
            remote_policy=RemotePolicy.HYBRID,
            industries=[IndustryCategory.SAAS],
            tech_stack=["TypeScript", "React", "C++", "WebAssembly"],
            founded_year=2012,
            locations=["San Francisco, CA", "New York, NY"]
        ),
        "canva": StartupProfile(
            name="Canva",
            logo_url="https://logo.clearbit.com/canva.com",
            website="https://canva.com",
            careers_url="https://canva.com/careers",
            stage=StartupStage.PUBLIC,
            funding_amount=572_000_000,
            team_size=4000,
            remote_policy=RemotePolicy.HYBRID,
            industries=[IndustryCategory.SAAS],
            tech_stack=["JavaScript", "React", "Java", "Scala"],
            founded_year=2012,
            locations=["Sydney, AU", "Manila, PH"]
        ),
        "rippling": StartupProfile(
            name="Rippling",
            logo_url="https://logo.clearbit.com/rippling.com",
            website="https://rippling.com",
            careers_url="https://rippling.com/careers",
            stage=StartupStage.SERIES_D_PLUS,
            funding_amount=1_200_000_000,
            team_size=2000,
            remote_policy=RemotePolicy.HYBRID,
            industries=[IndustryCategory.SAAS, IndustryCategory.FINTECH],
            tech_stack=["TypeScript", "React", "Python", "Go"],
            founded_year=2016,
            locations=["San Francisco, CA", "New York, NY"]
        ),
        "deel": StartupProfile(
            name="Deel",
            logo_url="https://logo.clearbit.com/deel.com",
            website="https://deel.com",
            careers_url="https://deel.com/careers",
            stage=StartupStage.SERIES_D_PLUS,
            funding_amount=679_000_000,
            team_size=3000,
            remote_policy=RemotePolicy.FULLY_REMOTE,
            industries=[IndustryCategory.FINTECH, IndustryCategory.SAAS],
            tech_stack=["TypeScript", "React", "Node.js", "PostgreSQL"],
            founded_year=2019,
            locations=["Remote"]
        ),
        "scale-ai": StartupProfile(
            name="Scale AI",
            logo_url="https://logo.clearbit.com/scale.com",
            website="https://scale.com",
            careers_url="https://scale.com/careers",
            stage=StartupStage.SERIES_D_PLUS,
            funding_amount=603_000_000,
            team_size=500,
            remote_policy=RemotePolicy.HYBRID,
            industries=[IndustryCategory.AI_ML],
            tech_stack=["Python", "TypeScript", "React", "PyTorch"],
            founded_year=2016,
            is_yc_company=True,
            locations=["San Francisco, CA"]
        ),
        "elevenlabs": StartupProfile(
            name="ElevenLabs",
            logo_url="https://logo.clearbit.com/elevenlabs.io",
            website="https://elevenlabs.io",
            careers_url="https://elevenlabs.io/careers",
            stage=StartupStage.SERIES_B,
            funding_amount=101_000_000,
            team_size=100,
            remote_policy=RemotePolicy.REMOTE_FIRST,
            industries=[IndustryCategory.AI_ML],
            tech_stack=["Python", "TypeScript", "React", "PyTorch"],
            founded_year=2022,
            locations=["New York, NY"]
        ),
        "railway": StartupProfile(
            name="Railway",
            logo_url="https://logo.clearbit.com/railway.app",
            website="https://railway.app",
            careers_url="https://railway.app/careers",
            stage=StartupStage.SERIES_A,
            funding_amount=26_000_000,
            team_size=30,
            remote_policy=RemotePolicy.FULLY_REMOTE,
            industries=[IndustryCategory.DEVELOPER_TOOLS, IndustryCategory.SAAS],
            tech_stack=["TypeScript", "Go", "React", "PostgreSQL"],
            founded_year=2020,
            locations=["Remote"]
        ),
        "planetscale": StartupProfile(
            name="PlanetScale",
            logo_url="https://logo.clearbit.com/planetscale.com",
            website="https://planetscale.com",
            careers_url="https://planetscale.com/careers",
            stage=StartupStage.SERIES_C,
            funding_amount=105_000_000,
            team_size=120,
            remote_policy=RemotePolicy.REMOTE_FIRST,
            industries=[IndustryCategory.DEVELOPER_TOOLS, IndustryCategory.SAAS],
            tech_stack=["Go", "TypeScript", "MySQL", "Vitess"],
            founded_year=2018,
            locations=["Mountain View, CA"]
        ),
        "mongodb": StartupProfile(
            name="MongoDB",
            logo_url="https://logo.clearbit.com/mongodb.com",
            website="https://mongodb.com",
            careers_url="https://mongodb.com/careers",
            stage=StartupStage.PUBLIC,
            team_size=4000,
            remote_policy=RemotePolicy.HYBRID,
            industries=[IndustryCategory.DEVELOPER_TOOLS, IndustryCategory.OPEN_SOURCE],
            tech_stack=["C++", "JavaScript", "Go", "Python"],
            founded_year=2007,
            locations=["New York, NY", "Austin, TX"]
        ),
        "posthog": StartupProfile(
            name="PostHog",
            logo_url="https://logo.clearbit.com/posthog.com",
            website="https://posthog.com",
            careers_url="https://posthog.com/careers",
            stage=StartupStage.SERIES_B,
            funding_amount=27_000_000,
            team_size=50,
            remote_policy=RemotePolicy.FULLY_REMOTE,
            industries=[IndustryCategory.DEVELOPER_TOOLS, IndustryCategory.OPEN_SOURCE],
            tech_stack=["Python", "TypeScript", "React", "PostgreSQL"],
            founded_year=2020,
            is_yc_company=True,
            locations=["Remote"]
        ),
        "airbyte": StartupProfile(
            name="Airbyte",
            logo_url="https://logo.clearbit.com/airbyte.com",
            website="https://airbyte.com",
            careers_url="https://airbyte.com/careers",
            stage=StartupStage.SERIES_B,
            funding_amount=181_000_000,
            team_size=150,
            remote_policy=RemotePolicy.FULLY_REMOTE,
            industries=[IndustryCategory.DEVELOPER_TOOLS, IndustryCategory.OPEN_SOURCE],
            tech_stack=["Java", "Python", "TypeScript", "React"],
            founded_year=2020,
            locations=["Remote"]
        ),
        "clickhouse": StartupProfile(
            name="ClickHouse",
            logo_url="https://logo.clearbit.com/clickhouse.com",
            website="https://clickhouse.com",
            careers_url="https://clickhouse.com/careers",
            stage=StartupStage.SERIES_B,
            funding_amount=300_000_000,
            team_size=200,
            remote_policy=RemotePolicy.REMOTE_FIRST,
            industries=[IndustryCategory.DEVELOPER_TOOLS, IndustryCategory.OPEN_SOURCE],
            tech_stack=["C++", "Python", "TypeScript"],
            founded_year=2021,
            locations=["Remote"]
        ),
        "huggingface": StartupProfile(
            name="Hugging Face",
            logo_url="https://logo.clearbit.com/huggingface.co",
            website="https://huggingface.co",
            careers_url="https://huggingface.co/careers",
            stage=StartupStage.SERIES_C,
            funding_amount=395_000_000,
            team_size=200,
            remote_policy=RemotePolicy.FULLY_REMOTE,
            industries=[IndustryCategory.AI_ML, IndustryCategory.OPEN_SOURCE],
            tech_stack=["Python", "PyTorch", "TypeScript", "React"],
            founded_year=2016,
            locations=["Remote"]
        ),
        "pinecone": StartupProfile(
            name="Pinecone",
            logo_url="https://logo.clearbit.com/pinecone.io",
            website="https://pinecone.io",
            careers_url="https://pinecone.io/careers",
            stage=StartupStage.SERIES_B,
            funding_amount=138_000_000,
            team_size=100,
            remote_policy=RemotePolicy.REMOTE_FIRST,
            industries=[IndustryCategory.AI_ML, IndustryCategory.DEVELOPER_TOOLS],
            tech_stack=["Python", "Go", "TypeScript", "React"],
            founded_year=2019,
            locations=["San Francisco, CA"]
        ),
        "cohere": StartupProfile(
            name="Cohere",
            logo_url="https://logo.clearbit.com/cohere.ai",
            website="https://cohere.ai",
            careers_url="https://cohere.ai/careers",
            stage=StartupStage.SERIES_C,
            funding_amount=445_000_000,
            team_size=250,
            remote_policy=RemotePolicy.HYBRID,
            industries=[IndustryCategory.AI_ML],
            tech_stack=["Python", "PyTorch", "TypeScript", "React"],
            founded_year=2019,
            locations=["Toronto, CA", "San Francisco, CA"]
        ),
        "mistral": StartupProfile(
            name="Mistral AI",
            logo_url="https://logo.clearbit.com/mistral.ai",
            website="https://mistral.ai",
            careers_url="https://mistral.ai/careers",
            stage=StartupStage.SERIES_B,
            funding_amount=640_000_000,
            team_size=60,
            remote_policy=RemotePolicy.HYBRID,
            industries=[IndustryCategory.AI_ML],
            tech_stack=["Python", "PyTorch", "Rust", "TypeScript"],
            founded_year=2023,
            locations=["Paris, FR"]
        ),
        "deepmind": StartupProfile(
            name="DeepMind",
            logo_url="https://logo.clearbit.com/deepmind.com",
            website="https://deepmind.com",
            careers_url="https://deepmind.com/careers",
            stage=StartupStage.PUBLIC,
            team_size=1500,
            remote_policy=RemotePolicy.HYBRID,
            industries=[IndustryCategory.AI_ML],
            tech_stack=["Python", "TensorFlow", "JAX", "C++"],
            founded_year=2010,
            locations=["London, UK", "Mountain View, CA"]
        ),
    }
    
    @classmethod
    def get_company(cls, company_name: str) -> Optional[StartupProfile]:
        """Get company profile by name"""
        key = company_name.lower().replace(" ", "-").replace(".", "")
        return cls.DREAM_COMPANIES.get(key)
    
    @classmethod
    def get_all_companies(cls) -> List[StartupProfile]:
        """Get all registered companies"""
        return list(cls.DREAM_COMPANIES.values())
    
    @classmethod
    def is_dream_company(cls, company_name: str) -> bool:
        """Check if company is in dream list"""
        return cls.get_company(company_name) is not None
    
    @classmethod
    def get_companies_by_industry(cls, industry: IndustryCategory) -> List[StartupProfile]:
        """Get companies by industry"""
        return [
            company for company in cls.DREAM_COMPANIES.values()
            if industry in company.industries
        ]
    
    @classmethod
    def get_yc_companies(cls) -> List[StartupProfile]:
        """Get Y Combinator companies"""
        return [
            company for company in cls.DREAM_COMPANIES.values()
            if company.is_yc_company
        ]
