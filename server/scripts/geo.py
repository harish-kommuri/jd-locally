import os

import pandas as pd
from sqlalchemy import create_engine

df = pd.read_csv("assets/csv/worldcities.csv")

indian_cities = df.loc[df["iso3"] == "IND"].copy()
indian_cities["capital"] = indian_cities["admin_name"]
indian_cities.drop(columns=["admin_name", "id"], inplace=True)

database_url = os.getenv("DATABASE_URL", "sqlite:///assets/db/geo.db")
engine = create_engine(database_url)

rows_written = indian_cities.to_sql(
	"indian_cities",
	engine,
	if_exists="replace",
	index=False
)

print(f"Rows exported: {rows_written}")
