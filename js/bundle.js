(function () {
  'use strict';

  class Helpers {
    dqs(selector) {
      return document.querySelectorAll(selector);
    }

    filterCollectionBy(collection, isValid) {
      return collection.reduce(([pass, fail], elem) => {
        return isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
      }, [[], []]);
    }

  }

  var helpers = new Helpers();

  class PandaFilter {
    constructor(showAnim, hideAnim, cms, activeClass = "pcms-filter-active", highlight = false) {
      this.highlight = highlight;
      this.hideAnim = hideAnim;
      this.showAnim = showAnim;
      this.cms = cms;
      this.collection = cms.collection;
      this.onChange = null;
      this.activeClass = activeClass;
      this.filterControls = {};
      this.findFilters();
      this.getFilterCategories();

      jQuery.expr[':'].icontains = function (a, i, m) {
        return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
      };
    }

    findFilters() {
      let container = this.cms.filtersContainer || this.cms.parentContainer;
      helpers.dqs(container + " [data-pf-ctrl]").forEach(el => {
        let [filterCategory, filterType] = [null, null];

        if (el.dataset["pfCategory"]) {
          [filterCategory, filterType] = el.dataset["pfCategory"].split(":");
        }

        if (!filterCategory) {
          el.setAttribute("data-pf-category", "default");
          filterCategory = "default";
        }

        if (!this.filterControls.hasOwnProperty(filterCategory)) this.filterControls[filterCategory] = [];
        this.filterControls[filterCategory].push(el);

        if (this.isButton(el)) {
          el.removeEventListener("click", this.handleFilterChange.bind(this));
          el.addEventListener("click", this.handleFilterChange.bind(this));
        } else if (this.isTextInput(el)) {
          el.removeEventListener("input", this.handleFilterChange.bind(this));
          el.addEventListener("input", this.handleFilterChange.bind(this));
        } else {
          el.removeEventListener("change", this.handleFilterChange.bind(this));
          el.addEventListener("change", this.handleFilterChange.bind(this));
        }
      });
    } // Handlers


    disableCategoryFilters(filtersCategory) {
      this.filterControls[filtersCategory].forEach(el => {
        el.classList.remove(this.activeClass);
      });
    }

    highlightTextIn(element, text) {
      element.el.innerHTML = element.el.innerHTML.replaceAll(/(<mark>|<\/mark>)/gi, "");
      if (!text) return;
      $(element.el).find("p").each((_, p) => {
        let re = new RegExp(text, "gi");
        p.innerHTML = p.innerHTML.replaceAll(re, "<mark>$&</mark>");
      });
    }

    handleFilterChange(event) {
      // @TODO: Make it work in other way later
      // Right now we're running this listener only if collection wrapper is visible
      if (this.cms.parentContainer) {
        if ($('div' + this.cms.parentContainer + ':visible').length == 0) {
          return;
        }
      }

      let [filterCategory, filterType] = event.currentTarget.dataset.pfCategory.split(":"); // If element already active then we're disabling it

      let multiFilter = filterType == "multi";
      let rangeFilter = filterType == "min" || filterType == "max";
      let textFilter = this.isTextInput(event.currentTarget);

      if (this.isSelect(event.currentTarget)) {
        if ($(event.currentTarget).val() == "*") {
          event.currentTarget.classList.remove(this.activeClass);
        } else {
          event.currentTarget.classList.add(this.activeClass);
        }
      } else if (event.currentTarget.classList.contains(this.activeClass) && !rangeFilter && !textFilter) {
        event.currentTarget.classList.remove(this.activeClass);
      } else {
        // If it's not active then we're activating it in case it's a button
        if (!multiFilter && !rangeFilter) {
          this.disableCategoryFilters(event.currentTarget.dataset.pfCategory);
        }

        event.currentTarget.classList.add(this.activeClass);
      }

      let results = $("[data-pf-el]");
      let activeFilters = this.getActiveFilters();
      Object.keys(activeFilters).forEach((categoryKey, _) => {
        [filterCategory, filterType] = categoryKey.split(":"); // If element already active then we're disabling it

        multiFilter = filterType == "multi";
        rangeFilter = filterType == "min" || filterType == "max";
        let queryParts = [];
        activeFilters[categoryKey].each((_, el) => {
          if ($(el).data("pfBy") == "*") return;
          let innerEl = $(el).data("pfBy").split(":")[0];
          let keyword = $(el).data("pfBy").split(":")[1];

          if (keyword == "value") {
            keyword = $(el).val();
          }

          if (!rangeFilter) {
            queryParts.push(`[data-pf-el] ${innerEl}:icontains(${keyword})`);
          }
        });

        if (queryParts.length) {
          results = results.filter((i, value) => {
            return $(queryParts.join(", ")).parents("[data-pf-el]").toArray().includes(value);
          });
        }

        if (rangeFilter) {
          results.filter((_, value) => {
            let rangeFilters = this.getRangeFilters();
            Object.keys(rangeFilters).forEach(key => {
              let min = parseFloat($(rangeFilters[key]["min"][0]).val());
              let max = parseFloat($(rangeFilters[key]["max"][0]).val());
              let pfBy = rangeFilters[key]["min"][0].dataset["pfBy"];
              let innerEl = pfBy.split(":")[0];
              pfBy.split(":")[1];
              results = results.filter((i, value) => {
                let price = parseFloat($(value).find(innerEl).text().replace(/[^0-9.,]+/g, ""));
                return price <= max && price >= min;
              });
            });
          });
        }
      });
      var [matchedElements, unmatchedElements] = helpers.filterCollectionBy(this.collection, element => {
        var elementToFilter = element.el;
        elementToFilter.innerHTML.replaceAll(/(<mark>|<\/mark>)/gi, "");
        return results.toArray().includes(element.el);
      });
      matchedElements.forEach(el => {
        if (this.highlight) {
          this.highlightTextIn(el, filterBy);
        }

        el.matchesFilter = true;
      });
      unmatchedElements.forEach(el => {
        el.matchesFilter = false;
        el.hide(this.hideAnim);
      });

      if (this.cms.paginate) {
        var alreadyVisibleElements = this.collection.filter(el => el.visible);
        matchedElements.filter(el => {
          return alreadyVisibleElements.indexOf(el) == -1;
        });

        if (alreadyVisibleElements.length > 0) {
          matchedElements = matchedElements.slice(0, this.cms.paginate.perPage - alreadyVisibleElements.length);
        } else {
          matchedElements = matchedElements.slice(0, this.cms.paginate.perPage * 1);
        }
      }

      matchedElements.forEach(el => {
        el.show(this.showAnim);
      });

      if (this.onChange) {
        this.onChange();
      }

      if (Object.keys(this.getActiveFilters()).length > 0) {
        $(this.cms.parentContainer).addClass('pcms-filtered');
      } else {
        $(this.cms.parentContainer).removeClass('pcms-filtered');
      }
    }

    getActiveFilters() {
      let activeFilters = {};
      this.categories.forEach(cat => {
        if ($(`${this.cms.filtersContainer} [data-pf-category='${cat}'].${this.activeClass}`).length > 0) {
          activeFilters[cat] = $(`[data-pf-category='${cat}'].${this.activeClass}`);
        }
      });
      return activeFilters;
    }

    getRangeFilters() {
      let activeFilters = {};
      this.categories.forEach(cat => {
        if (cat.split(":")[1] == "min" || cat.split(":")[1] == "max") {
          let category = cat.split(":")[0];
          let type = cat.split(":")[1];

          if ($(`${this.cms.filtersContainer} [data-pf-category='${cat}'].${this.activeClass}`).length > 0) {
            if (!activeFilters[category]) {
              activeFilters[category] = {};
            }

            activeFilters[category][type] = $(`${this.cms.filtersContainer} [data-pf-category='${cat}'].${this.activeClass}`);
          }
        }
      });
      return activeFilters;
    }

    getFilterCategories() {
      this.categories = [];
      $(`${this.cms.filtersContainer} [data-pf-category]`).each((index, el) => {
        if (!this.categories.includes($(el).data("pfCategory"))) {
          let category = $(el).data("pfCategory");
          if (category) this.categories.push(category);
        }
      });
    }

    isTextInput(el) {
      return ['textarea', 'input'].includes(el.tagName.toLowerCase()) && !['checkbox', 'radio'].includes(el.type);
    }

    isButton(el) {
      return !this.isTextInput(el) && !this.isSelect(el);
    }

    isSelect(el) {
      return el.tagName.toLowerCase() == "select";
    }

  }

  class PandaPaginate {
    constructor(perPage, cms, options = {}) {
      this.options = options;
      this.page = 1;
      this.cms = cms;
      this.morePageButton = helpers.dqs(this.cms.parentContainer + ' [data-pf-more-button]')[0];
      this.pageButtonsSelector = this.cms.parentContainer + ' ' + (options.pageButtonSelector || '[data-pf-page-button]');
      this.pageButtons = $(this.pageButtonsSelector);
      this.prevPageButton = $(this.cms.parentContainer + ' ' + (options.prevPageButtonSelector || '[data-pf-prev-page-button]'));
      this.nextPageButton = $(this.cms.parentContainer + ' ' + (options.nextPageButtonSelector || '[data-pf-next-page-button]'));
      this.availablePages = [];
      this.collection = this.cms.collection;
      this.perPage = perPage;
      this.totalPages = 1;

      if (this.cms.filter) {
        this.setObserver();
      }

      this.prepareCollection();
      this.initPagesButtons();
      this.setListeners();

      if (this.totalPages > 1 && this.pageButtons.length == 0) {
        this.showMorePageButton();
      } else {
        this.hideMorePageButton();
      }
    }

    initPagesButtons() {
      var _this$options$initPag;

      (_this$options$initPag = this.options['initPagesButtons']) === null || _this$options$initPag === void 0 ? void 0 : _this$options$initPag.call(this.totalPages);
    }

    prepareCollection() {
      this.totalPages = Math.ceil(this.cms.collection.length / this.perPage);
      this.availablePages = [...Array(this.totalPages).keys()];
      this.cms.collection.slice(this.perPage, this.cms.collection.length).forEach(el => el.hide());
    }

    setListeners() {
      var _this$morePageButton;

      $(this.prevPageButton).click(() => {
        let currentPage = parseInt(this.page);
        let prevPage = currentPage - 1;

        if (this.options['hideArrow'] && prevPage == 1) {
          this.prevPageButton.fadeTo(500, 0);
          this.nextPageButton.fadeTo(500, 1);
        } else {
          this.nextPageButton.fadeTo(500, 1);
          this.prevPageButton.fadeTo(500, 1);
        }

        if (currentPage == 1) return;
        $(this.pageButtonsSelector).removeClass('active');
        $(this.pageButtonsSelector + ":contains(" + prevPage + ")").addClass('active');
        this.showPage(prevPage);
      });
      $(this.nextPageButton).click(() => {
        let currentPage = parseInt(this.page);
        let nextPage = currentPage + 1;

        if (this.options['hideArrow'] && nextPage == this.totalPages) {
          this.nextPageButton.fadeTo(500, 0);
          this.prevPageButton.fadeTo(500, 1);
        } else {
          this.nextPageButton.fadeTo(500, 1);
          this.prevPageButton.fadeTo(500, 1);
        }

        if (currentPage == this.totalPages) return;
        $(this.pageButtonsSelector).removeClass('active');
        $(this.pageButtonsSelector + ":contains(" + nextPage + ")").addClass('active');
        this.showPage(nextPage);
      });
      $(this.pageButtonsSelector).click(e => {
        $(this.pageButtonsSelector).removeClass('active');
        $(e.currentTarget).addClass('active');
        let currentPage = parseInt($(e.currentTarget).text());

        if (currentPage == 1 && this.options['hideArrow']) {
          this.prevPageButton.fadeTo(500, 0);
          this.nextPageButton.fadeTo(500, 1);
        } else if (currentPage == this.totalPages - 1 && this.options['hideArrow']) {
          this.nextPageButton.fadeTo(500, 0);
          this.prevPageButton.fadeTo(500, 1);
        } else {
          this.nextPageButton.fadeTo(500, 1);
          this.prevPageButton.fadeTo(500, 1);
        }

        this.showPage(currentPage);
      });
      (_this$morePageButton = this.morePageButton) === null || _this$morePageButton === void 0 ? void 0 : _this$morePageButton.addEventListener('click', this.nextPage.bind(this));
    }

    setObserver() {
      $(this.pageButtonsSelector).click(e => {
        $(this.pageButtonsSelector).removeClass('active');
        $(e.currentTarget).addClass('active');
        this.showPage($(e.currentTarget).text());
      });
      this.cms.filter.onChange = this.collectionChangeCallback.bind(this);
    }

    collectionChangeCallback() {
      this.page = 1;
      this.totalPages = Math.ceil(this.cms.collection.filter(el => el.matchesFilter).length / this.perPage);
      this.availablePages = [...Array(this.totalPages).keys()];

      if (this.totalPages > 1) {
        this.showMorePageButton();
      }
    }

    hideMorePageButton() {
      var _this$morePageButton2;

      (_this$morePageButton2 = this.morePageButton) === null || _this$morePageButton2 === void 0 ? void 0 : _this$morePageButton2.classList.add('pcms-hidden');
    }

    showMorePageButton() {
      if (this.totalPages > 1) {
        this.morePageButton.classList.remove('pcms-hidden');
      }
    }

    showPage(pageNumber) {
      var _this$options$onShowP;

      var filteredElements = this.collection.filter(el => {
        return el.matchesFilter;
      });
      this.page = pageNumber;
      filteredElements.forEach(el => el.hide());
      var start = this.perPage * (this.page - 1);
      var end = start + this.perPage;
      filteredElements.slice(start, end).forEach(el => el.show());
      (_this$options$onShowP = this.options['onShowPage']) === null || _this$options$onShowP === void 0 ? void 0 : _this$options$onShowP.call();
    }

    nextPage() {
      if (this.page + 1 == this.totalPages) {
        this.hideMorePageButton();
      }

      var filteredElements = this.collection.filter(el => {
        return el.matchesFilter && !el.visible;
      });
      var nextPageElements = filteredElements.slice(0, this.perPage);
      nextPageElements.forEach(el => el.show());

      if (nextPageElements.length > 0) {
        this.page += 1;
      }
    }

  }

  class Element {
    constructor(el) {
      this.el = el;
      this.visible = true;
      this.matchesFilter = true;
      this.observer = null;
    }

    hide(hideFunction = null) {
      if (!this.visible) return;

      if (hideFunction) {
        hideFunction(this.el);
      } else {
        $(this.el).hide();
      }

      this.visible = false;
    }

    show(showFunction = null) {
      if (this.visible) return;

      if (showFunction) {
        showFunction(this.el);
      } else {
        $(this.el).show();
      }

      this.visible = true;
    } // Not sure why we need that


    isVisible() {
      if (!this.el.offsetHeight && !this.el.offsetWidth) {
        return false;
      }

      if (getComputedStyle(this.el).visibility === 'hidden') {
        return false;
      }

      return true;
    }

  }

  class PandaCMS {
    constructor(parentContainer = "", options = {}) {
      this.collection = [];
      this.parentContainer = parentContainer;
      this.filtersContainer = options['filtersContainer'] || '';
      helpers.dqs(parentContainer + ' [data-pf-el]').forEach(el => {
        this.collection.push(new Element(el));
      });
      this.filter = null;
      this.paginate = null;
    }

    enableFilter(showAnim, hideAnim, activeClass = '', highlight = false) {
      this.filter = new PandaFilter(showAnim, hideAnim, this, activeClass, highlight);
      return this.filter;
    }

    enablePagination(perPage, options = {}) {
      this.paginate = new PandaPaginate(perPage, this, options);
      return this.paginate;
    }

  }

  window.PandaCMS = PandaCMS;

}());
