// Power Query (M)
// Cashflow Ledger export from Hedge Control backend
//
// Usage:
// - Update BackendHost and ReportsPublicToken
// - Choose CsvOrJson = "csv" or "json"
//
let
    BackendHost = "https://<YOUR_BACKEND_HOST>",
    ApiPrefix = "",
    ReportsPublicToken = "<REPORTS_PUBLIC_TOKEN>",
    CsvOrJson = "csv",
    AsOf = "2026-01-20",

    BaseUrl = BackendHost & ApiPrefix & "/reports/cashflow-ledger-public",
    Url = BaseUrl & "?token=" & ReportsPublicToken & "&format=" & CsvOrJson & "&as_of=" & AsOf,

    Source =
        if CsvOrJson = "csv" then
            Csv.Document(
                Web.Contents(Url),
                [Delimiter = ",", Encoding = 65001, QuoteStyle = QuoteStyle.Csv]
            )
        else
            let
                J = Json.Document(Web.Contents(Url))
            in
                Table.FromRecords(J),

    Promoted =
        if CsvOrJson = "csv" then
            Table.PromoteHeaders(Source, [PromoteAllScalars = true])
        else
            Source,

    Typed = Table.TransformColumnTypes(
        Promoted,
        {
            {"valuation_as_of_date", type date},
            {"valuation_reference_date", type date},
            {"deal_id", Int64.Type},
            {"deal_uuid", type text},
            {"entity_type", type text},
            {"entity_id", Int64.Type},
            {"source_reference", type text},
            {"category", type text},
            {"date", type date},
            {"side", type text},
            {"price_type", type text},
            {"quantity_mt", type number},
            {"unit_price_used", type number},
            {"premium_usd_per_mt", type number},
            {"amount_usd", type number},
            {"amount_usd_abs", type number},
            {"direction", type text},
            {"lme_symbol_used", type text},
            {"lme_price_type", type text},
            {"lme_price_ts_date", type datetime},
            {"notes", type text}
        }
    )
in
    Typed
