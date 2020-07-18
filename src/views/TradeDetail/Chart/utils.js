import Helper from '@/lib'
const datafeedConfig = (params) => {
  let {resolution, datafeeds, symbolInfo} = params;
  let locale = Helper.getCache('setting')['language']
  let style = {
    up: locale
      ? locale === 'ko'
        ? "#d60000"
        : "#589065" : "#589065",
    down: locale
      ? locale === 'ko'
        ? "#0051c7"
        : "#c8413b" : "#c8413b",
    // up: "#589065", down: "#c8413b",
    bg: "#ffffff",
    grid: "#ffffff",
    cross: "#9194A3",
    border: "#4e5b85",
    text: "#61688A",
    areatop: "rgba(122, 152, 247, .1)",
    areadown: "rgba(122, 152, 247, .02)",
  };

  return {
    // debug: true,
    fullscreen: false,
    preset: 'mobile',
    symbol: symbolInfo.virtualCoinName,
    interval: resolution,
    container_id: 'tv_chart_container',
    datafeed: datafeeds,
    width: "100%",
    height: 420,
    library_path: "static/charting_library/",
    custom_css_url: "day.css",
    locale: locale,
    toolbar_bg: "transparent",
    drawings_access: {
      type: 'black',
      tools: [
        {
          name: 'Regression Trend'
        }
      ]
    },
    save_load_adapter: true,
    // autosize: true,
    timezone: "Asia/Seoul",
    disabled_features: [
      'header_symbol_search',
      'use_localstorage_for_settings',
      'symbol_search_hot_key',
      'header_chart_type',
      'header_compare',
      'header_undo_redo',
      'header_screenshot',
      'header_saveload',
      'timeframes_toolbar',
      'context_menus',
      'left_toolbar',
      'volume_force_overlay',
      'header_indicators', //图表指标 'header_settings', //设置
      'header_resolutions', //时间下拉框
      'header_fullscreen_button', //全屏按钮
      'control_bar',
    ],
    enabled_features: [
      'study_templates',
      "dont_show_boolean_study_arguments",
      "hide_last_na_study_output",
      "move_logo_to_main_pane",
      "same_data_requery",
      "side_toolbar_in_fullscreen_mode"
    ],
    charts_storage_url: 'https://saveload.tradingview.com',
    charts_storage_api_version: '1.1',
    client_id: 'tradingview.com',
    user_id: 'public_user_id',
    /*         time_frames: [
              { text: "1min", resolution: "5s", description: "1 min" },
              { text: "1h", resolution: "1", description: "1 hour" },
              { text: "1d", resolution: "5", description: "1 Days" },
            ], */
    overrides: {
      volumePaneSize: "small",
      "scalesProperties.showRightScale": true,
      "scalesProperties.lineColor": style.text,
      "scalesProperties.textColor": style.text,
      "paneProperties.background": style.bg,
      "paneProperties.vertGridProperties.color": style.grid,
      "paneProperties.horzGridProperties.color": style.grid,
      "paneProperties.crossHairProperties.color": style.cross,
      "paneProperties.legendProperties.showLegend": !!style.showLegend,
      "paneProperties.legendProperties.showStudyArguments": true,
      "paneProperties.legendProperties.showStudyTitles": true,
      "paneProperties.legendProperties.showStudyValues": true,
      "paneProperties.legendProperties.showSeriesTitle": true,
      "paneProperties.legendProperties.showSeriesOHLC": true,
      "mainSeriesProperties.showPriceLine": true,
      "mainSeriesProperties.priceLineWidth": 1,
      "mainSeriesProperties.priceAxisProperties.autoScale": true,
      "mainSeriesProperties.priceAxisProperties.autoScaleDisabled": false,
      "mainSeriesProperties.priceAxisProperties.percentage": false,
      "mainSeriesProperties.priceAxisProperties.percentageDisabled": false,
      "mainSeriesProperties.candleStyle.upColor": style.up,
      "mainSeriesProperties.candleStyle.downColor": style.down,
      "mainSeriesProperties.candleStyle.drawWick": true,
      "mainSeriesProperties.candleStyle.drawBorder": true,
      "mainSeriesProperties.candleStyle.borderColor": style.border,
      "mainSeriesProperties.candleStyle.borderUpColor": style.up,
      "mainSeriesProperties.candleStyle.borderDownColor": style.down,
      "mainSeriesProperties.candleStyle.wickUpColor": style.up,
      "mainSeriesProperties.candleStyle.wickDownColor": style.down,
      "mainSeriesProperties.candleStyle.barColorsOnPrevClose": false,
      "mainSeriesProperties.hollowCandleStyle.upColor": style.up,
      "mainSeriesProperties.hollowCandleStyle.downColor": style.down,
      "mainSeriesProperties.hollowCandleStyle.drawWick": true,
      "mainSeriesProperties.hollowCandleStyle.drawBorder": true,
      "mainSeriesProperties.hollowCandleStyle.borderColor": style.border,
      "mainSeriesProperties.hollowCandleStyle.borderUpColor": style.up,
      "mainSeriesProperties.hollowCandleStyle.borderDownColor": style.down,
      "mainSeriesProperties.hollowCandleStyle.wickColor": style.line,
      "mainSeriesProperties.haStyle.upColor": style.up,
      "mainSeriesProperties.haStyle.downColor": style.down,
      "mainSeriesProperties.haStyle.drawWick": true,
      "mainSeriesProperties.haStyle.drawBorder": true,
      "mainSeriesProperties.haStyle.borderColor": style.border,
      "mainSeriesProperties.haStyle.borderUpColor": style.up,
      "mainSeriesProperties.haStyle.borderDownColor": style.down,
      "mainSeriesProperties.haStyle.wickColor": style.border,
      "mainSeriesProperties.haStyle.barColorsOnPrevClose": false,
      "mainSeriesProperties.barStyle.upColor": style.up,
      "mainSeriesProperties.barStyle.downColor": style.down,
      "mainSeriesProperties.barStyle.barColorsOnPrevClose": false,
      "mainSeriesProperties.barStyle.dontDrawOpen": false,
      "mainSeriesProperties.lineStyle.color": style.border,
      "mainSeriesProperties.lineStyle.linewidth": 1,
      "mainSeriesProperties.lineStyle.priceSource": "close",
      "mainSeriesProperties.areaStyle.color1": style.areatop,
      "mainSeriesProperties.areaStyle.color2": style.areadown,
      "mainSeriesProperties.areaStyle.linecolor": style.border,
      "mainSeriesProperties.areaStyle.linewidth": 1,
      "mainSeriesProperties.areaStyle.priceSource": "close"
    },
    studies_overrides: {
      "volume.volume.color.0": style.down,
      "volume.volume.color.1": style.up
      // "volume.volume.transparency": 70, "volume.volume ma.color": style.down,
      // "volume.volume ma.transparency": 30, "volume.volume ma.linewidth": 5,
      // "volume.show ma": true, "volume.options.showStudyArguments": false,
      // "bollinger bands.median.color": style.up, "bollinger bands.upper.linewidth":
      // 7
    }
  }
}
const chartReady = (widget) => {
  widget.MAStudies = [];
  widget.selectedIntervalButton = null;
  let chart = widget.chart();
  let mas = [
    {
      day: 5,
      color: "#821f68"
    }, {
      day: 10,
      color: "#5c7798"
    }, {
      day: 30,
      color: "#397d51"
    }, {
      day: 60,
      color: "#60407f"
    }
  ];
  // let buttons = [
  //   {
  //     label: 'h',
  //     resolution: "1",
  //     chartType: 3
  //   }, {
  //     label: "1min",
  //     resolution: "1"
  //   }, {
  //     label: "5min",
  //     resolution: "5"
  //   }, {
  //     label: "15min",
  //     resolution: "15"
  //   }, {
  //     label: "30min",
  //     resolution: "30"
  //   }, {
  //     label: "1hour",
  //     resolution: "60"
  //   }, {
  //     //   label: "4hour",   resolution: "240" }, {
  //     label: "1day",
  //     resolution: "1D"
  //   }, {
  //     //   label: "5day",   resolution: "5D" }, {
  //     label: "1week",
  //     resolution: "1W"
  //   }, {
  //     label: "1mon",
  //     resolution: "1M"
  //   }
  // ];
  mas.forEach(item => {
    chart.createStudy("Moving Average", false, false, [item.day], entity => {
      widget
        .MAStudies
        .push(entity);
    }, {"plot.color": item.color});
  });

  // chart.onIntervalChanged().subscribe(null, function (interval, obj) {
  // widget.changingInterval = false; });

  // buttons.forEach((item, index) => {
  //   let button = widget.createButton();

  //   item.resolution === widget.options.interval && updateSelectedIntervalButton(button);
  //   button
  //     .attr("data-resolution", item.resolution)
  //     .attr("data-chart-type", item.chartType === undefined
  //       ? 1
  //       : item.chartType)
  //     .html("<span>" + item.label + "</span>")
  //     .on("click", function () {
  //       // !widget.changingInterval &&
  //       if (!button.hasClass("selected")) {
  //         let chartType = +button.attr("data-chart-type");
  //         let resolution = button.attr("data-resolution");

  //         if (chart.resolution() !== resolution) {
  //           // widget.changingInterval = true;
  //           chart.setResolution(resolution);
  //         }
  //         if (chart.chartType() !== chartType) {
  //           chart.setChartType(chartType);
  //           // 											widget.applyOverrides({ 												"mainSeriesProperties.style":
  //           // chartType 											});
  //         }
  //         updateSelectedIntervalButton(button);
  //         showMAStudies(chartType !== 3);
  //       }
  //     })
  // });

  // function updateSelectedIntervalButton(button) {
  //   widget.selectedIntervalButton && widget
  //     .selectedIntervalButton
  //     .removeClass("selected");
  //   button.addClass("selected");
  //   widget.selectedIntervalButton = button;
  // }

  // function showMAStudies(visible) {
  //   widget
  //     .MAStudies
  //     .forEach(item => {
  //       chart.setEntityVisibility(item, visible);
  //     })
  // }
}

export default {
  datafeedConfig,
  chartReady
}
