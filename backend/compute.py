import json
import requests

def builddict(id = None):
    search_url="https://api.hypothes.is/api/search"
    offset = 0
    id2text_dict = {}
    while(True):
        if (id):
            payload = {
                "user": id,
                "tag":"pttdev",
                "limit": 200,
                "offset": offset,
                "sort": "created"
            }
        else:
            payload = {
                "tag":"pttdev",
                "limit": 200,
                "offset": offset,
                "sort": "created"
            }
        result = requests.get(search_url, params=payload).json()
        offset += result["total"]

        # TODO: 重複的 annotation 目前只算1次、連續推文算幾次

        for anno in result["rows"]:
            # text = anno["target"][0]["selector"][2]["exact"]
            text = json.loads(anno["text"])
            id = text["id"]
            tmp = {
                "content": text["content"],
                "ip": text["ip"],
                "time": text["time"],
                "url": anno["uri"]
            }
            try:
                id2text_dict[id]["count"] += 1
                try:    # if the annotation exist
                    id2text_dict[id]["data"].index(tmp)
                except: # if not
                    id2text_dict[id]["data"].append(tmp)
            except:
                id2text_dict[id] = {"count": 1, "data": [tmp]}
        if result["total"] < 200:
            break
    return id2text_dict


def query(id):
    """
    return:
    {
        "count": int
        "data": [{
            "content": string,
            "ip": string,
            "time": string,
            "url": string
            # "annotate_count": int,
        },...]
    }
    """
    # get data
    id2text_dict = builddict()
    print(id)
    print(id2text_dict)
    # search
    try:
        return id2text_dict[id]
    except:
        return {"count": 0, "data":[]}


def globalrank():
    """
    return: [{
        "rank": rank, 
        "id": id, 
        "cnt": cnt
    },...][:10]
    """
    # get data
    id2text_dict = builddict()

    # rank
    board = sorted( ((v["count"], k) for k, v in id2text_dict.items()), reverse=True)
    r = 1
    ret = {}
    for cnt, id in board[:10]:
        if r == 1:
            ret[r] = {"rank": r, "id": id, "cnt": cnt}
        else:
            last_cnt = ret[r-1]["cnt"]
            if last_cnt == cnt:
                ret[r] = {"rank": ret[r-1]["rank"], "id": id, "cnt": cnt}
            else:
                ret[r] = {"rank": r, "id": id, "cnt": cnt}

        r += 1
    return ret

def myrank(id):
    """
    return: [
        {1: {
            "rank": rank, 
            "id": id, 
            "cnt": cnt
            }
        },
        {2: {
            ...
            }
        }
    ,...][:10]
    """
    # get my data
    myid2text_dict = builddict(id)

    # rank
    board = sorted( ((v["count"], k) for k, v in myid2text_dict.items()), reverse=True)
    r = 1
    ret = {}
    for cnt, id in board[:10]:
        if r == 1:
            ret[r] = {"rank": r, "id": id, "cnt": cnt}
        else:
            last_cnt = ret[r-1]["cnt"]
            if last_cnt == cnt:
                ret[r] = {"rank": ret[r-1]["rank"], "id": id, "cnt": cnt}
            else:
                ret[r] = {"rank": r, "id": id, "cnt": cnt}
        r += 1
    return ret
