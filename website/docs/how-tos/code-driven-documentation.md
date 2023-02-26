---
sidebar_label: "Code-Driven Documentation"
title: "Code-Driven Documentation: How to Eliminate Errors in Configuration Documentation"
description: "Introduce how to utilize code to enhance the accuracy of configuration documentation, particularly for technical writers who might not be well-versed in coding but are responsible for creating or reviewing configuration files."
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

This document outlines how to utilize code to enhance the accuracy of configuration documentation, particularly for technical writers who might not be well-versed in coding but are responsible for creating or reviewing configuration files. By following the examples in this document, writers can ensure that their configuration files are correct, efficient, and easy to understand, while also reducing the risk of errors or inconsistencies.

<!--truncate-->

[Documentation-drivern development](https://johnsamuel.info/en/programming/documentation-driven-development.html) emphasizes the importance of creating documentation that meets the needs of users. Code-driven documentation here prioritizes the accuracy and consistency of documentation by relying on the source of truth, which is the **code** itself. By using code to validate documentation, technical writers can ensure that their documentation is up-to-date and correctly reflects the behavior of the system, which can help to reduce errors and improve the overall quality of the documentation.

The following uses some configuration files as examples to illustrate how to use code to enhance the accuracy of configuration documentation. For example, the following configuration files are used:

| Product | Configuration file | Language | Example |
| :--- | :--- | :--- | :--- |
| [TiDB](https://github.com/pingcap/tidb) | [`config.toml`](https://docs.pingcap.com/tidb/stable/tidb-configuration-file/) | Go | [Example 1](#example-1-tidb-configuration-file--configgo) |
| [TiKV](https://github.com/tikv/tikv) | [`config.toml`](https://docs.pingcap.com/tidb/stable/tikv-configuration-file/) | Rust | [Example 2](#example-2-tikv-configuration-file--configrs) |
| [TiFlash](https://github.com/pingcap/tiflash) | [`tiflash.toml`](https://docs.pingcap.com/tidb/stable/tiflash-configuration/) | C++ | [Example 3](#example-3-tiflash-configuration-file) |
| [PD](https://github.com/tikv/pd) | [`config.toml`](https://docs.pingcap.com/tidb/stable/pd-configuration-file/) | Go | [Example 4](#example-4-pd-configuration-file--configgo) |

## Example 1: TiDB configuration file & `config.go`

The TiDB configuration file is written in TOML format. The documentation is [TiDB configuration file](https://docs.pingcap.com/tidb/stable/tidb-configuration-file).

### Steps

The following takes [`log.level`](https://docs.pingcap.com/tidb/stable/tidb-configuration-file#level) as an example:

```markdown
## Log

Configuration items related to log.

### `level`

+ Specifies the log output level.
+ Value options: `debug`, `info`, `warn`, `error`, and `fatal`.
+ Default value: `info`
```

1. Create a shallow clone of the TiDB repository:

    ```bash
    git clone https://github.com/pingcap/tidb.git --depth=1 tidb
    ```

2. Search for **`"level"`** or `toml:"level"` in the `tidb` folder. The following uses [`find`](https://linux.die.net/man/1/find) and [`grep`](https://linux.die.net/man/1/grep) commands to search and list all files that contain the `level` keyword:

    <Tabs>
    <TabItem value="command" label="Command">

    ```bash
    cd tidb
    find .  | grep -l -r "\"level\""
    ```

    </TabItem>
    <TabItem value="output" label="Output">

    ```bash
    ./config/config.go
    ./planner/core/memtable_predicate_extractor.go
    ./dumpling/log/log.go
    ./parser/parser_test.go
    ./parser/parser.go
    ./infoschema/metric_table_def.go
    ./br/pkg/lightning/tikv/tikv.go
    ./br/pkg/lightning/lightning.go
    ./br/pkg/lightning/log/log.go
    ./br/pkg/lightning/restore/precheck_impl_test.go
    ./sessionctx/stmtctx/stmtctx.go
    ```

    </TabItem>
    </Tabs>

    From the preceding output, you can skip the `./parser/parser_test.go` and `./br/pkg/lightning/restore/precheck_impl_test.go` files because they are test files. Then, search for the `"level"` keyword again:

    <Tabs>
    <TabItem value="command" label="Command">

    ```bash
    find . | grep -r "\"level\"" --exclude "*_test.go"
    ```

    </TabItem>
    <TabItem value="output" label="Output">

    ```bash
    ./config/config.go:	Level string `toml:"level" json:"level"`
    ./planner/core/memtable_predicate_extractor.go:	remained, levlSkipRequest, logLevels := e.extractCol(schema, names, remained, "level", true)
    ./dumpling/log/log.go:	Level string `toml:"level" json:"level"`
    ./parser/parser.go:		"level",
    ./infoschema/metric_table_def.go:		Labels:  []string{"instance", "level", "db"},
    ./infoschema/metric_table_def.go:		Labels:  []string{"instance", "cf", "level", "db"},
    ./br/pkg/lightning/tikv/tikv.go:	task := log.With(zap.Int32("level", level), zap.String("tikv", tikvAddr)).Begin(zap.InfoLevel, "compact cluster")
    ./br/pkg/lightning/lightning.go:		Level zapcore.Level `json:"level"`
    ./br/pkg/lightning/log/log.go:	Level string `toml:"level" json:"level"`
    ./sessionctx/stmtctx/stmtctx.go:	Level  string        `json:"level"`
    ```

    </TabItem>
    </Tabs>

    Then, you can see the context of the `"level"` keyword in other files:

    <Tabs>
    <TabItem value="File 1">

    ```go title="config/config.go"
    type Log struct {
        // Log level.
        // highlight-start
        Level string `toml:"level" json:"level"`
        // highlight-end
        // ...
    }
    ```

    </TabItem>
    <TabItem value="File 2">

    ```go title="planner/core/memtable_predicate_extractor.go"
    func (e *ClusterLogTableExtractor) Extract(
        ctx sessionctx.Context,
        schema *expression.Schema,
        names []*types.FieldName,
        predicates []expression.Expression,
    ) []expression.Expression {
        // ...
        // highlight-start
        remained, levlSkipRequest, logLevels := e.extractCol(schema, names, remained, "level", true)
        //highlight-end
        e.SkipRequest = typeSkipRequest || addrSkipRequest || levlSkipRequest
        // ...
    ```
    </TabItem>
    <TabItem value="File 3">

    ```go title="dumpling/log/log.go"
    // Config serializes log related config in toml/json.
    type Config struct {
        // Log level.
        // One of "debug", "info", "warn", "error", "dpanic", "panic", and "fatal".
        // highlight-start
        Level string `toml:"level" json:"level"`
        // highlight-end
        // ...
    }
    }
    ```

    </TabItem>
    <TabItem value="File 4">

    ```go title="parser/parser.go"
    yySymNames = []string{
        // ...
        "language",
        // highlight-start
        "level",
        // highlight-end
        "list",
        // ...
    }
    ```

    </TabItem>
    <TabItem value="File 5">

    ```go title="infoschema/metric_table_def.go"
    var MetricTableMap = map[string]MetricTableDef{
        // ...
        "tikv_compression_ratio": {
            PromQL:  `avg(tikv_engine_compression_ratio{$LABEL_CONDITIONS}) by (level,instance,db)`,
            // highlight-start
            Labels:  []string{"instance", "level", "db"},
            // highlight-end
            Comment: "The compression ratio of each level",
        },
        // ...
        "tikv_number_files_at_each_level": {
            PromQL:  `avg(tikv_engine_num_files_at_level{$LABEL_CONDITIONS}) by (cf, level,db,instance)`,
            // highlight-start
            Labels:  []string{"instance", "cf", "level", "db"},
            // highlight-end
            Comment: "The number of SST files for different column families in each level",
        },
        // ...
    }
    ```
    </TabItem>
    <TabItem value="File 6">

    ```go title="br/pkg/lightning/tikv/tikv.go"
    // Compact performs a leveled compaction with the given minimum level.
    func Compact(ctx context.Context, tls *common.TLS, tikvAddr string, level int32) error {
        // highlight-start
        task := log.With(zap.Int32("level", level), zap.String("tikv", tikvAddr)).Begin(zap.InfoLevel, "compact cluster")
        // highlight-end
        // ...
    }
    ```

    </TabItem>
    <TabItem value="File 7">

    ```go title="br/pkg/lightning/lightning.go"
    func handleLogLevel(w http.ResponseWriter, req *http.Request) {
        w.Header().Set("Content-Type", "application/json")

        var logLevel struct {
            // highlight-start
            Level zapcore.Level `json:"level"`
            // highlight-end
        }
        // ...
    }
    ```

    </TabItem>
    <TabItem value="File 8">

    ```go title="br/pkg/lightning/log/log.go"
    type Config struct {
        // Log level.
        // highlight-start
        Level string `toml:"level" json:"level"`
        // highlight-end
        // Log filename, leave empty to disable file log.
        File string `toml:"file" json:"file"`
        // ...
    }
    ```

    </TabItem>
    <TabItem value="File 9">

    ```go title="sessionctx/stmtctx/stmtctx.go"
    type jsonSQLWarn struct {
        // highlight-start
        Level  string        `json:"level"`
        // highlight-end
        SQLErr *terror.Error `json:"err,omitempty"`
        Msg    string        `json:"msg,omitempty"`
    }
    ```

    </TabItem>
    </Tabs>

3. Validate the data type:

    ```go title="config/config.go"
    type Log struct {
        // Log level.
        // highlight-start
        Level string `toml:"level" json:"level"`
        // highlight-end
        // ...
    }
    ```

    The `level` item is defined in the `Log` struct, the variable name is `Level`, and the type is **`string`**. Then, you can validate whether the type of `log.level` in the document is consistent with the type of `Level` in the code.

4. To validate the default value, search for `Level` in the `config/config.go` file, and you can find the default value of `Level` is **`"info"`**:

    ```go title="config/config.go"
    // highlight-start
    var defaultConf = Config{
    // highlight-end
        Host:                         DefHost,
        AdvertiseAddress:             "",
        Port:                         DefPort,
        // ...
        Log: Log{
            // highlight-next-line
            Level:               "info",
            Format:              "text",
            // ...
        },
        // ...
    }
    ```

5. To validate whether `level` is in the `log` [table](`flow-round-by-digit`) or not, search for `"log"` in the `config.go` file. You can find the following:

    ```go title="config/config.go"
    type Config struct {
        Host             string `toml:"host" json:"host"`
        // ...
        // highlight-next-line
        Log                        Log                     `toml:"log" json:"log"`
        // ...
    }
    // ...
    type Log struct {
        // Log level.
        // highlight-start
        Level string `toml:"level" json:"level"`
        // highlight-end
        // ...
    }
    ```

    The `level` is defined in the `Log` struct, that is, `level` is in the `log` table.

### Conclusion

In the `config/config.go`, you can validate the following information of `CONFIG-NAME` by search `"CONFIG-NAME"`:

- The **type** of a configuration item.
- The **default value** of a configuration item.
- The **table** that a configuration item belongs to.

## Example 2: TiKV configuration file & `config.rs`

The TiKV configuration file is written in TOML format. The documentation is [TiKV configuration file](https://docs.pingcap.com/tidb/stable/tikv-configuration-file).

### Steps

The following takes [`raftstore.right-derive-when-split`](https://docs.pingcap.com/zh/tidb/dev/tikv-configuration-file#right-derive-when-split) as an example:

1. Create a shallow clone of the TiKV repository:

    ```bash
    git clone https://github.com/tikv/tikv.git --depth=1 tikv
    ```

2. Search for **`right(.*)derive(.*)when(.*)split`** in the `tikv` folder.

3. Validate the data type in the `components/raftstore/src/store/config.rs` file:

    The configuration item is defined as `pub right_derive_when_split: bool` in the `Config` struct. The type is **`bool`**. Then, you can validate whether the type of `raftstore.right-derive-when-split` in the document is consistent with the type in the code.

    ```rust title="components/raftstore/src/store/config.rs"
    struct Config {
        // Right region derive origin region id when split.
        #[online_config(hidden)]
        // highlight-next-line
        pub right_derive_when_split: bool,
        // ...
    }
    ```

4. Validate the default value in the `components/raftstore/src/store/config.rs` file. The default value is **`true`**:

    ```rust title="components/raftstore/src/store/config.rs"
    impl Default for Config {
        fn default() -> Config {
            Config {
                prevote: true,
                raftdb_path: String::new(),
                // ...
                // highlight-next-line
                right_derive_when_split: true,
                // ...
            }
        }
    }
    ```

### Conclusion

In the `components/.../config.rs`, you can validate the following information of `CONFIG-NAME` by search `CONFIG(.*)NAME` or `CONFIG_NAME`:

- The **type** of a configuration item.
- The **default value** of a configuration item.
- The **value range** of a configuration item.

## Example 3: TiFlash configuration file

### Steps

The TiFlash configuration file is written in TOML format. The documentation is [TiFlash configuration file](https://docs.pingcap.com/tidb/stable/tiflash-configuration#configure-the-tiflashtoml-file). The following takes `storage.format_version` as an example.

1. Create a shallow clone of the TiFlash repository:

    ```bash
    git clone https://github.com/pingcap/tiflash.git -depth 1 tiflash
    ```

2. Search for `"format_version"` in the `tiflash` folder. You can find the following output:

    ```cpp title="dbms/src/Server/StorageConfigParser.cpp"
    void TiFlashStorageConfig::parseMisc(const String & storage_section, Poco::Logger * log)
    {
        std::istringstream ss(storage_section);
        cpptoml::parser p(ss);
        auto table = p.parse();

        // ...
        // highlight-next-line
        if (auto version = table->get_qualified_as<UInt64>("format_version"); version)
        {
            format_version = *version;
        }
        // ...
    }
    ```

3. Then, search for which file calls the `format_version` and `TiFlashStorageConfig` at the same time. You can use the `TiFlashStorageConfig(?:.|\n)*format_version|format_version(?:.|\n)*TiFlashStorageConfig` regular expression and find the following output:

    ```cpp title="dbms/src/Server/Server.cpp"
    size_t global_capacity_quota = 0;
    // highlight-next-line
    TiFlashStorageConfig storage_config;
    std::tie(global_capacity_quota, storage_config) = TiFlashStorageConfig::parseSettings(config(), log);

    //highlight-next-line
    if (storage_config.format_version)
    {
        setStorageFormat(storage_config.format_version);
        LOG_FMT_INFO(log, "Using format_version={} (explicit stable storage format detected).", storage_config.format_version);
    }
    else
    {
        LOG_FMT_INFO(log, "Using format_version={} (default settings).", STORAGE_FORMAT_CURRENT.identifier);
    }
    ```

    In the preceding `Server.cpp` file, `storage_config.format_version` is used to get the value of `format_version` and `setStorageFormat()` is used to set the value of `format_version`.

4. Search for `setStorageFormat` and you can find the following output:

    ```cpp title="dbms/src/Storages/FormatVersion.h"
    inline void setStorageFormat(UInt64 setting)
    {
        STORAGE_FORMAT_CURRENT = toStorageFormat(setting);
    }

    inline void setStorageFormat(const StorageFormatVersion & version)
    {
        STORAGE_FORMAT_CURRENT = version;
    }
    ```

    If `storage_config.format_version` is `UInt64` type, then `toStorageFormat(setting)` is used to convert its value to `StorageFormatVersion` type:

    ```cpp title="dbms/src/Storages/FormatVersion.h"
    inline const StorageFormatVersion & toStorageFormat(UInt64 setting)
    {
        switch (setting)
        {
        case 1:
            return STORAGE_FORMAT_V1;
        case 2:
            return STORAGE_FORMAT_V2;
        case 3:
            return STORAGE_FORMAT_V3;
        case 4:
            return STORAGE_FORMAT_V4;
        default:
            throw Exception("Illegal setting value: " + DB::toString(setting));
        }
    }
    ```

    In the preceding `toStorageFormat()` function, if `setting` is `1`, then `STORAGE_FORMAT_V1` is returned. If `setting` is not `1`, `2`, `3`, or `4`, an exception is thrown.

5. Search for `STORAGE_FORMAT_V1` and you can find the following output:

    ```cpp title="dbms/src/Storages/FormatVersion.h"
    inline static const StorageFormatVersion STORAGE_FORMAT_V1 = StorageFormatVersion{
        .segment = SegmentFormat::V2,
        .dm_file = DMFileFormat::V1,
        .stable = StableFormat::V1,
        .delta = DeltaFormat::V2,
        .page = PageFormat::V2,
        .identifier = 1,
    };
    ```

## Example 4: PD configuration file & `config.go`

The PD configuration file is written in TOML format and the documentation is [PD configuration file](https://docs.pingcap.com/tidb/stable/pd-configuration-file).

### Steps

The following takes [`pd-server.flow-round-by-digit`](https://docs.pingcap.com/tidb/stable/pd-configuration-file#flow-round-by-digit-new-in-tidb-51) as an example.

1. Create a shallow clone of the PD repository:

    ```bash
    git clone https://github.com/tikv/pd.git -depth 1 pd
    ```

2. Search for **`"flow-round-by-digit"`** in the `pd` folder. You can find the following output:

    ```go title="server/config/config.go"
    type PDServerConfig struct {
        // ...
        // FlowRoundByDigit used to discretization processing flow information.
        // highlight-next-line
	    FlowRoundByDigit int `toml:"flow-round-by-digit" json:"flow-round-by-digit"`
    }
    ```

    The `flow-round-by-digit` is defined in the `PDServerConfig` struct and its type is **`int`**.

3. Search for `FlowRoundByDigit` in `config.go` and you can find the following output:

    ```go title="server/config/config.go"
    const(
        // highlight-next-line
        defaultFlowRoundByDigit  = 3 // KB
    )
    ```

    The default value of `flow-round-by-digit` is **`3`**.

4. To validate whether `flow-round-by-digit` is in the `pd-server` [table](`flow-round-by-digit`) or not, search for `"pd-server"` in the `config.go` file. You can find the following output:

    ```go title="server/config/config.go"
    type Config struct {
        // ...
        // highlight-next-line
        PDServerCfg PDServerConfig `toml:"pd-server" json:"pd-server"`
        // ...
    }
    ```

    Then, search for `PDServerConfig` and you can find the following output:

    ```go title="server/config/config.go"
    type PDServerConfig struct {
        // ...
        // MetricStorage is the cluster metric storage.
        // Currently we use prometheus as metric storage, we may use PD/TiKV as metric storage later.
        MetricStorage string `toml:"metric-storage" json:"metric-storage"`
        // There are some values supported: "auto", "none", or a specific address, default: "auto"
        DashboardAddress string `toml:"dashboard-address" json:"dashboard-address"`
        // TraceRegionFlow the option to update flow information of regions.
        // WARN: TraceRegionFlow is deprecated.
        TraceRegionFlow bool `toml:"trace-region-flow" json:"trace-region-flow,string,omitempty"`
        // FlowRoundByDigit used to discretization processing flow information.
        // highlight-next-line
        FlowRoundByDigit int `toml:"flow-round-by-digit" json:"flow-round-by-digit"`
        // MinResolvedTSPersistenceInterval is the interval to save the min resolved ts.
        MinResolvedTSPersistenceInterval typeutil.Duration `toml:"min-resolved-ts-persistence-interval" json:"min-resolved-ts-persistence-interval"`
    }
    ```

    The `FlowRoundByDigit` is defined in the `PDServerConfig` struct, that is, `flow-round-by-digit` is in the `pd-server` table.

### Conclusion

In the `server/config/config.go`, you can validate the following information of `CONFIG-NAME` by search `"CONFIG-NAME"`:

- The **type** of a configuration item.
- The **default value** of a configuration item.
- The **table** that a configuration item belongs to.

## What's next?

- How to validate configuration files using code automatically?

- How to generate configuration files from code automatically?