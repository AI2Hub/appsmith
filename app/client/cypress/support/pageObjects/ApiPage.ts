import { AggregateHelper } from "./AggregateHelper";
const agHelper = new AggregateHelper();

export class ApiPage {

    private _createapi = ".t--createBlankApiCard"
    private _resourceUrl = ".t--dataSourceField"
    private _headerKey = (index: number) => ".t--actionConfiguration\\.headers\\[0\\]\\.key\\." + index + ""
    private _headerValue = (index: number) => ".t--actionConfiguration\\.headers\\[0\\]\\.value\\." + index + ""
    private _paramKey = (index: number) => ".t--actionConfiguration\\.queryParameters\\[0\\]\\.key\\." + index + ""
    private _paramValue = (index: number) => ".t--actionConfiguration\\.queryParameters\\[0\\]\\.value\\." + index + ""
    private _paramsTab = "//li//span[text()='Params']"
    private _apiRunBtn = ".t--apiFormRunBtn"
    private _queryTimeout = "//input[@name='actionConfiguration.timeoutInMillisecond']"
    private _apiTab = (tabValue: string) => "span:contains('" + tabValue + "')"

    CreateAPI(apiname: string) {
        cy.get(this._createapi).click({ force: true });
        cy.wait("@createNewApi");
        cy.get(this._resourceUrl).should("be.visible");
        agHelper.RenameWithInPane(apiname)
        agHelper.WaitAutoSave()
        // Added because api name edit takes some time to
        // reflect in api sidebar after the call passes.
        cy.wait(2000);
    }

    EnterURL(url: string) {
        cy.get(this._resourceUrl)
            .first()
            .click({ force: true })
            .type(url, { parseSpecialCharSequences: false });
        agHelper.WaitAutoSave()
    }

    EnterHeader(hKey: string, hValue: string) {
        cy.get(this._headerKey(0))
            .first()
            .click({ force: true })
            .type(hKey, { parseSpecialCharSequences: false });
        cy.get(this._headerValue(0))
            .first()
            .click({ force: true })
            .type(hValue, { parseSpecialCharSequences: false });
        agHelper.WaitAutoSave()
    }

    EnterParams(pKey: string, pValue: string) {
        cy.xpath(this._paramsTab)
            .should("be.visible")
            .click({ force: true });
        cy.get(this._paramKey(0))
            .first()
            .click({ force: true })
            .type(pKey, { parseSpecialCharSequences: false });
        cy.get(this._paramValue(0))
            .first()
            .click({ force: true })
            .type(pValue, { parseSpecialCharSequences: false });
        agHelper.WaitAutoSave()
    }

    RunAPI() {
        cy.get(this._apiRunBtn).click({ force: true });
        cy.wait("@postExecute").should(
            "have.nested.property",
            "response.body.data.isExecutionSuccess",
            true,
        );
    }

    SetAPITimeout(timeout : number) {
        cy.get(this._apiTab('Settings')).click();
        cy.xpath(this._queryTimeout)
            .clear()
            .type(timeout.toString());

        cy.get(this._apiTab('Header')).click();
    }
}
