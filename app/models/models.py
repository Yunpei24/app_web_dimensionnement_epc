from pydantic import BaseModel
import sqlite3

class TraficInModel(BaseModel):
    nombreSession: int
    tailleSession: int
    pourcentageDL: float

class TraficOutModel(BaseModel):
    volumeTrafDLUL: float
    volumeTrafDL: float

class ConfigEntreeModel(BaseModel):
    nombreAbonnee: int
    pourcentageCard: float
    pourcentageSmartphone: float
    pourcentageAboActifAccessInternet: float
    pourcentageAboUseVpn: float

class ConfigOutModel(BaseModel):
    nombreAbonnee: int
    nombreAbonneeCard: int
    nombreAbonneeSmartphone: int
    nombreAbonneeActifAccessInternet: int
    nombreAbonneeUseVpn: int
