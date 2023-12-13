import os
import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import app.routers.routes as api

app = FastAPI()
app.include_router(api.router)

static_directory = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'app/static')

app.mount('/static', StaticFiles(directory=static_directory), name='app/static')

templates_directory = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'app/templates')
templates = Jinja2Templates(directory=templates_directory)

@app.get('/', response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse('index.html', {"request": request})

@app.get('/configuration', response_class=HTMLResponse)
async def configuration(request: Request):
    return templates.TemplateResponse('configuration.html', {"request": request})

@app.get('/trafic_genere', response_class=HTMLResponse)
async def trafic_gere(request: Request):
    return templates.TemplateResponse('trafic_genere.html', {"request": request})

@app.get('/trafic_total')
async def trafic_total(request: Request):
    return templates.TemplateResponse('trafic_total.html', {"request": request})

@app.get('/plan_control')
async def plan_control(request: Request):
    return templates.TemplateResponse('dim_plan_control.html', {"request": request})

@app.get('/plan_usager', response_class=HTMLResponse)
async def plan_usager(request: Request):
    return templates.TemplateResponse('dim_plan_usager.html', {"request": request})

@app.get('/interfaces_plan_control')
async def plan_usager(request: Request):
    return templates.TemplateResponse('interfaces_plan_control.html', {"request": request})

@app.get('/noeud_LTE')
async def plan_usager(request: Request):
    return templates.TemplateResponse('dim_noeuds_LTE.html', {"request": request})

# if __name__ == "__main__":
#     uvicorn.run(app, host="localhost", port=8000)