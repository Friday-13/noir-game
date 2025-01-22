import asyncio
from db.session import engine, Base

async def init_db():
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.drop_all)
        print("Database cleared successfully.")
        await connection.run_sync(Base.metadata.create_all)
        print("Database created successfully.")


if __name__ == "__main__":
    asyncio.run(init_db())
