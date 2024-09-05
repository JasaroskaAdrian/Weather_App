import hh from "hyperscript-helpers";
import { h } from "virtual-dom";
import createElement from "virtual-dom/create-element";
import diff from "virtual-dom/diff";
import patch from "virtual-dom/patch";

const { div, button, input, p, h3, h4 } = hh(h);

const MSGS = {
    ADD_WEATHER_REPORT: 'ADD_WEATHER_REPORT',
    REMOVE_WEATHER_REPORT: 'REMOVE_WEATHER_REPORT',
    UPDATE_REPORT: 'UPDATE_REPORT'
};

function weatherApi(location, dispatch) {
    const baseAPIurl = 'https://api.openweathermap.org/data/2.5/weather';
    const APPID = 'bc1f1d95d73fb246c06f030b6d51b6af';
    const APIurl = `${baseAPIurl}?q=${encodeURI(location)}&units=metric&APPID=${APPID}`;

    return async function() {
        try {
            const response = await fetch(APIurl);
            
            if (response.status === 200) {
                const body = await response.json();
                console.log(body);
                const temperatures = {
                    location,
                    temp: body.main.temp,
                    minTemp: body.main.temp_min,
                    maxTemp: body.main.temp_max
                };
                dispatch(MSGS.ADD_WEATHER_REPORT, temperatures);
            }  
        } catch (error) {
            console.log(error);
        }
    };
}

function view(dispatch, model) {
    const btnStyle = "cursor-pointer transition-all bg-blue-500 text-white px-6 py-2 rounded-lg border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]";

    return div({ className: "flex flex-col gap-4 items-center" }, [
        input({
            className: "w-full border p-2",
            oninput: (e) => dispatch(MSGS.UPDATE_REPORT, e.target.value),
            value: model.currentLocation,
            placeholder: "Enter Location..."
        }),
        button(
            {
                className: btnStyle,
                onclick: weatherApi(model.currentLocation, dispatch)
            },
            "Get Report"
        ),
        div({ className: "weather-reports" }, [
            ...model.weatherReports.map((report, index) =>
                div({ className: "weather-report" }, [
                    h4(report.location),
                    p(`Temperature: ${report.temp}°C`),
                    p(`Max: ${report.maxTemp}°C`),
                    p(`Min: ${report.minTemp}°C`),
                    button(
                        {
                            className: "text-red-500",
                            onclick: () => dispatch(MSGS.REMOVE_WEATHER_REPORT, index)
                        },
                        "Remove"
                    )
                ])
            )
        ])
    ]);
}

function update(msg, model, dispatch, value) {
    switch (msg) {
        case MSGS.UPDATE_REPORT:
            return {
                ...model,
                currentLocation: value
            };
        
        case MSGS.ADD_WEATHER_REPORT:
            return {
                ...model,
                weatherReports: [...model.weatherReports, value],
                currentLocation: ""
            };
        
        case MSGS.REMOVE_WEATHER_REPORT:
            const weatherReports = model.weatherReports.filter((_, index) => index !== value);
            return { ...model, weatherReports };
        
        default:
            return model;
    }
}

function app(initialModel, update, view, node) {
    let model = initialModel;
    let currentView = view(dispatch, model);
    let rootNode = createElement(currentView);
    node.appendChild(rootNode);

    function dispatch(msg, value) {
        model = update(msg, model, dispatch, value);
        const updatedView = view(dispatch, model);
        const patches = diff(currentView, updatedView);
        rootNode = patch(rootNode, patches);
        currentView = updatedView;
    }
}

const initialModel = {
    currentLocation: "",
    weatherReports: []
};

const rootNode = document.getElementById("app");
app(initialModel, update, view, rootNode);
