from datetime import datetime, timedelta
from typing import Dict, List, Optional
import json
from collections import defaultdict, Counter

# Firestore/Firebase ile uyumlu analiz fonksiyonları burada olmalı.
# SQLAlchemy ve SQL tabanlı kodlar kaldırıldı.

class AnalyticsTracker:
    """
    Backend analytics ve metrik takibi için sınıf
    """
    
    def __init__(self):
        # Gerçek implementasyonda bu veriler veritabanında saklanacak
        self.user_sessions = defaultdict(list)
        self.feature_usage = defaultdict(int)
        self.error_logs = []
        self.performance_metrics = []
        self.user_behavior = defaultdict(list)
    
    def track_user_session(self, user_id: int, action: str, metadata: Dict = None):
        """
        Kullanıcı oturum aktivitesini takip eder
        """
        session_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "action": action,
            "metadata": metadata or {},
            "user_id": user_id
        }
        self.user_sessions[user_id].append(session_data)
        
        # Feature usage sayacı
        self.feature_usage[action] += 1
    
    def track_api_performance(self, endpoint: str, duration_ms: float, status_code: int):
        """
        API performansını takip eder
        """
        perf_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "endpoint": endpoint,
            "duration_ms": duration_ms,
            "status_code": status_code
        }
        self.performance_metrics.append(perf_data)
    
    def track_error(self, error_type: str, error_message: str, user_id: Optional[int] = None):
        """
        Hataları takip eder
        """
        error_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "error_type": error_type,
            "error_message": error_message,
            "user_id": user_id
        }
        self.error_logs.append(error_data)
    
    def track_model_accuracy(self, model_type: str, input_data: str, output_data: str, confidence: float = None):
        """
        AI model doğruluğunu takip eder
        """
        accuracy_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "model_type": model_type,
            "input_length": len(input_data),
            "output_length": len(output_data),
            "confidence": confidence
        }
        self.user_behavior["model_usage"].append(accuracy_data)
    
    def get_user_analytics(self, user_id: int, days: int = 30) -> Dict:
        """
        Kullanıcı analitik raporunu döner
        """
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        user_sessions = self.user_sessions.get(user_id, [])
        
        # Son X günün verilerini filtrele
        recent_sessions = [
            session for session in user_sessions
            if datetime.fromisoformat(session["timestamp"]) > cutoff_date
        ]
        
        # İstatistikleri hesapla
        actions = [session["action"] for session in recent_sessions]
        action_counts = Counter(actions)
        
        return {
            "user_id": user_id,
            "period_days": days,
            "total_sessions": len(recent_sessions),
            "unique_actions": len(action_counts),
            "most_used_features": action_counts.most_common(5),
            "activity_by_day": self._group_by_day(recent_sessions),
            "last_activity": recent_sessions[-1]["timestamp"] if recent_sessions else None
        }
    
    def get_system_analytics(self, days: int = 7) -> Dict:
        """
        Sistem geneli analitik raporunu döner
        """
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        # Performans metrikleri
        recent_perf = [
            metric for metric in self.performance_metrics
            if datetime.fromisoformat(metric["timestamp"]) > cutoff_date
        ]
        
        # Hata analizi
        recent_errors = [
            error for error in self.error_logs
            if datetime.fromisoformat(error["timestamp"]) > cutoff_date
        ]
        
        # Feature kullanım istatistikleri
        total_users = len(self.user_sessions)
        
        return {
            "period_days": days,
            "total_users": total_users,
            "total_api_calls": len(recent_perf),
            "average_response_time": sum(m["duration_ms"] for m in recent_perf) / len(recent_perf) if recent_perf else 0,
            "error_rate": len(recent_errors) / len(recent_perf) if recent_perf else 0,
            "most_used_features": Counter(self.feature_usage).most_common(10),
            "error_types": Counter(e["error_type"] for e in recent_errors),
            "status_code_distribution": Counter(m["status_code"] for m in recent_perf)
        }
    
    def get_model_performance_report(self, model_type: str = None, days: int = 30) -> Dict:
        """
        AI model performans raporunu döner
        """
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        model_usage = self.user_behavior.get("model_usage", [])
        
        # Filtrele
        recent_usage = [
            usage for usage in model_usage
            if datetime.fromisoformat(usage["timestamp"]) > cutoff_date
            and (model_type is None or usage["model_type"] == model_type)
        ]
        
        if not recent_usage:
            return {"message": "No model usage data found"}
        
        # İstatistikleri hesapla
        avg_confidence = sum(u.get("confidence", 0) for u in recent_usage) / len(recent_usage)
        model_types = Counter(u["model_type"] for u in recent_usage)
        
        return {
            "period_days": days,
            "total_requests": len(recent_usage),
            "average_confidence": avg_confidence,
            "model_distribution": dict(model_types),
            "average_input_length": sum(u["input_length"] for u in recent_usage) / len(recent_usage),
            "average_output_length": sum(u["output_length"] for u in recent_usage) / len(recent_usage)
        }
    
    def _group_by_day(self, sessions: List[Dict]) -> Dict:
        """
        Oturumları güne göre gruplar
        """
        daily_counts = defaultdict(int)
        for session in sessions:
            date = datetime.fromisoformat(session["timestamp"]).date()
            daily_counts[date.isoformat()] += 1
        return dict(daily_counts)

# Global analytics tracker instance
analytics_tracker = AnalyticsTracker()

# Convenience functions
def track_user_action(user_id: int, action: str, metadata: Dict = None):
    """Kullanıcı aksiyonunu takip et"""
    analytics_tracker.track_user_session(user_id, action, metadata)

def track_api_call(endpoint: str, duration_ms: float, status_code: int):
    """API çağrısını takip et"""
    analytics_tracker.track_api_performance(endpoint, duration_ms, status_code)

def track_model_usage(model_type: str, input_data: str, output_data: str, confidence: float = None):
    """Model kullanımını takip et"""
    analytics_tracker.track_model_accuracy(model_type, input_data, output_data, confidence)

def track_error_event(error_type: str, error_message: str, user_id: Optional[int] = None):
    """Hata olayını takip et"""
    analytics_tracker.track_error(error_type, error_message, user_id) 